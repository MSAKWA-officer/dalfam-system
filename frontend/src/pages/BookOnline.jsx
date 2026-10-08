import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { formatCurrency, formatDate, getAssetUrl } from '../utils/format';
import Navbar, { NAV_LINKS } from '../components/Navbar';

// ---------------------------------------------------------------------------
// EDITABLE CONTENT — keep in sync with Contact/About pages.
// ---------------------------------------------------------------------------
const COMPANY_PHONE_DISPLAY = '+255 718 258 199';
const COMPANY_WHATSAPP_NUMBER = '255718258199'; // digits only, with country code
const COMPANY_EMAIL = 'info@dalfam.co.tz';
const COMPANY_LOCATION = 'Mbeya, Tanzania';

// Social media links. Replace with real URLs, or remove a line to hide it.
const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/' },
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'YouTube', href: 'https://youtube.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

const STATUS_STYLES = {
  pending: { label: 'Pending confirmation', cls: 'bg-yellow-100 text-yellow-900' },
  confirmed: { label: 'Confirmed', cls: 'bg-green-100 text-green-900' },
  completed: { label: 'Completed', cls: 'bg-blue-100 text-blue-900' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-900' },
};

const STEPS = ['Choose tour', 'Your details', 'Confirmation'];

const inputCls =
  'w-full px-4 py-2.5 rounded-md border border-gray-300 bg-white text-black text-sm focus:outline-none focus:border-dalfam-gold focus:ring-1 focus:ring-dalfam-gold';

function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-dalfam-dark mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-gray-600 mt-1">{hint}</span>}
    </label>
  );
}

function PackageImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-dalfam-green/10 text-dalfam-green ${className}`}>
        <svg width="28%" height="28%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="M21 16l-5.5-5-4 4-2-2L3 18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return <img src={src} alt={alt} className={`object-cover ${className}`} onError={() => setFailed(true)} />;
}

function Stepper({ step }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const current = step === n;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  done || current ? 'bg-dalfam-green text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {done ? '✓' : n}
              </span>
              <span className={`text-sm hidden sm:inline ${current ? 'font-semibold text-dalfam-dark' : 'text-gray-600'}`}>
                {label}
              </span>
            </div>
            {n < STEPS.length && <span className="w-6 sm:w-12 h-px bg-gray-300" />}
          </li>
        );
      })}
    </ol>
  );
}

export default function BookOnline() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('package') || '';

  const [tab, setTab] = useState('book'); // 'book' | 'track'
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [form, setForm] = useState({
    packageId: preselected,
    startDate: '',
    numberOfGuests: 1,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: '',
    website: '', // honeypot — must stay empty
  });
  const [step, setStep] = useState(preselected ? 2 : 1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Track tab
  const [track, setTrack] = useState({ reference: '', phone: '' });
  const [tracking, setTracking] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [trackResult, setTrackResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/packages/public');
        setPackages(data);
        // If the ?package= id isn't a valid public package, start from step 1.
        if (preselected && !data.some((p) => String(p.id) === String(preselected))) {
          setForm((f) => ({ ...f, packageId: '' }));
          setStep(1);
        }
      } catch (err) {
        console.error(err);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [preselected]);

  const selected = useMemo(
    () => packages.find((p) => String(p.id) === String(form.packageId)) || null,
    [packages, form.packageId]
  );

  const guests = Math.max(1, parseInt(form.numberOfGuests, 10) || 1);
  const total = selected ? Number(selected.price) * guests : 0;

  const endDate = useMemo(() => {
    if (!selected || !form.startDate) return '';
    const d = new Date(form.startDate);
    d.setDate(d.getDate() + Math.max(1, selected.durationDays || 1) - 1);
    return d.toISOString().slice(0, 10);
  }, [selected, form.startDate]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const setGuests = (n) => {
    const max = selected?.maxGuests || 50;
    setForm((f) => ({ ...f, numberOfGuests: Math.min(max, Math.max(1, n)) }));
  };

  const choosePackage = (id) => {
    setForm((f) => ({ ...f, packageId: String(id), numberOfGuests: 1 }));
    setError('');
  };

  const goDetails = () => {
    if (!selected) return setError('Please choose a tour package to continue.');
    if (!form.startDate) return setError('Please choose your travel date.');
    if (form.startDate < todayStr()) return setError('Travel date cannot be in the past.');
    setError('');
    return setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.customerName.trim().length < 2) return setError('Please enter your full name.');
    if (form.customerPhone.replace(/\D/g, '').length < 9) return setError('Please enter a valid phone number.');

    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/bookings/public', {
        ...form,
        numberOfGuests: guests,
      });
      setResult(data.booking || null);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'We could not send your booking. Please try again or contact us on WhatsApp.'
      );
    } finally {
      setSubmitting(false);
    }
    return null;
  };

  const resetBooking = () => {
    setForm({
      packageId: '', startDate: '', numberOfGuests: 1, customerName: '',
      customerPhone: '', customerEmail: '', notes: '', website: '',
    });
    setResult(null);
    setStep(1);
    setError('');
  };

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(result.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* clipboard blocked — ignore */ }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setTracking(true);
    setTrackError('');
    setTrackResult(null);
    try {
      const { data } = await api.get('/bookings/public/track', { params: track });
      setTrackResult(data);
    } catch (err) {
      setTrackError(err.response?.data?.message || 'Could not look up your booking. Please try again.');
    } finally {
      setTracking(false);
    }
  };

  const whatsappHref = (text) =>
    `https://wa.me/${COMPANY_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  return (
    <div className="min-h-screen bg-dalfam-cream">
      <Navbar active="Tourism" />

      {/* Hero */}
      <section className="relative text-white overflow-hidden bg-dalfam-dark">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(47,74,60,1) 0%, rgba(18,36,31,1) 60%, rgba(201,162,75,0.35) 140%)',
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 text-center">
          <span className="text-xs tracking-widest font-semibold text-dalfam-gold">BOOK ONLINE</span>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl mt-2">Plan Your Tanzanian Adventure</h1>
          <p className="mt-4 text-gray-200 max-w-2xl mx-auto">
            Choose a tour, pick your dates and send your booking in minutes. Our team will confirm
            with you personally.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full bg-white border border-gray-200 p-1">
            {[
              ['book', 'Book a Tour'],
              ['track', 'Track My Booking'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  tab === key ? 'bg-dalfam-green text-white' : 'text-dalfam-dark hover:text-dalfam-gold'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------------ BOOK TAB ------------------------------ */}
        {tab === 'book' && (
          <>
            <Stepper step={step} />

            {loading && <p className="text-center text-black">Loading tours...</p>}

            {!loading && loadError && (
              <p className="text-center text-black">
                We couldn't load our tours right now. Please try again shortly or{' '}
                <a href={whatsappHref('Hello DALFAM, I would like to book a tour.')} target="_blank" rel="noopener noreferrer" className="text-dalfam-green font-medium hover:text-dalfam-gold">
                  book via WhatsApp
                </a>.
              </p>
            )}

            {!loading && !loadError && packages.length === 0 && (
              <div className="text-center text-black">
                <p className="mb-4">No tours are open for online booking at the moment.</p>
                <Link to="/contact" className="inline-block px-6 py-3 rounded-md bg-dalfam-gold text-dalfam-dark font-semibold hover:bg-yellow-500 transition-colors">
                  Contact Us
                </Link>
              </div>
            )}

            {!loading && !loadError && packages.length > 0 && step < 3 && (
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left: steps */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                  {error && (
                    <div role="alert" className="mb-6 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">
                      {error}
                    </div>
                  )}

                  {/* STEP 1 */}
                  {step === 1 && (
                    <div>
                      <h2 className="font-serif text-xl font-bold text-dalfam-dark mb-5">1. Choose your tour</h2>
                      <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {packages.map((p) => {
                          const active = String(p.id) === String(form.packageId);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => choosePackage(p.id)}
                              className={`text-left rounded-lg overflow-hidden border-2 transition-all ${
                                active ? 'border-dalfam-gold shadow-md' : 'border-gray-200 hover:border-dalfam-green/50'
                              }`}
                            >
                              <PackageImage
                                src={p.imageUrl ? getAssetUrl(p.imageUrl) : null}
                                alt={p.name}
                                className="w-full h-36"
                              />
                              <div className="p-4">
                                <h3 className="font-serif font-bold text-dalfam-dark leading-snug">{p.name}</h3>
                                <p className="text-xs text-gray-600 mt-1">
                                  {p.durationDays} day(s) · Up to {p.maxGuests} guests
                                </p>
                                <p className="text-sm font-semibold text-dalfam-green mt-2">
                                  {formatCurrency(p.price)} <span className="text-xs font-normal text-gray-600">per person</span>
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Travel date" required hint="The day your tour starts.">
                          <input
                            type="date"
                            name="startDate"
                            min={todayStr()}
                            value={form.startDate}
                            onChange={handleChange}
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Number of guests" required hint={selected ? `Up to ${selected.maxGuests} guests` : 'Choose a tour first'}>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setGuests(guests - 1)} className="w-10 h-10 rounded-md border border-gray-300 text-lg hover:border-dalfam-gold" aria-label="Fewer guests">−</button>
                            <span className="w-10 text-center font-semibold text-black">{guests}</span>
                            <button type="button" onClick={() => setGuests(guests + 1)} className="w-10 h-10 rounded-md border border-gray-300 text-lg hover:border-dalfam-gold" aria-label="More guests">+</button>
                          </div>
                        </Field>
                      </div>

                      <div className="mt-8 text-right">
                        <button type="button" onClick={goDetails} className="px-6 py-3 rounded-md bg-dalfam-gold text-dalfam-dark font-semibold hover:bg-yellow-500 transition-colors">
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <form onSubmit={handleSubmit} noValidate>
                      <h2 className="font-serif text-xl font-bold text-dalfam-dark mb-5">2. Your details</h2>

                      {/* Selected tour recap with quick edit */}
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-dalfam-cream border border-gray-200 px-4 py-3 mb-6 text-sm">
                        <span className="text-black">
                          <strong>{selected?.name}</strong> · {form.startDate ? formatDate(form.startDate) : 'choose a date'} · {guests} guest(s)
                        </span>
                        <button type="button" onClick={() => setStep(1)} className="text-dalfam-green font-semibold hover:text-dalfam-gold">
                          Change
                        </button>
                      </div>

                      {/* Honeypot (hidden from people, bots tend to fill it) */}
                      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
                        <label>
                          Website
                          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
                        </label>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Full name" required>
                          <input name="customerName" value={form.customerName} onChange={handleChange} autoComplete="name" className={inputCls} placeholder="e.g. Amina Juma" />
                        </Field>
                        <Field label="Phone / WhatsApp" required hint="We'll call or WhatsApp you to confirm.">
                          <input name="customerPhone" type="tel" value={form.customerPhone} onChange={handleChange} autoComplete="tel" className={inputCls} placeholder="+255 7XX XXX XXX" />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Email (optional)">
                            <input name="customerEmail" type="email" value={form.customerEmail} onChange={handleChange} autoComplete="email" className={inputCls} placeholder="you@example.com" />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="Special requests (optional)" hint="Pickup location, dietary needs, accessibility, celebrations...">
                            <textarea name="notes" rows={4} maxLength={1000} value={form.notes} onChange={handleChange} className={inputCls} />
                          </Field>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mt-5">
                        Sending this form does not charge you. Your booking stays <strong>pending</strong> until our team confirms
                        availability and agrees payment details with you.
                      </p>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-dalfam-green hover:text-dalfam-gold">
                          &larr; Back
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-3 rounded-md bg-dalfam-green text-white font-semibold hover:bg-dalfam-dark transition-colors disabled:opacity-60"
                        >
                          {submitting ? 'Sending...' : 'Confirm Booking Request'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Right: live summary */}
                <aside className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:sticky lg:top-28">
                  <PackageImage
                    src={selected?.imageUrl ? getAssetUrl(selected.imageUrl) : null}
                    alt={selected?.name || 'Tour'}
                    className="w-full h-40"
                  />
                  <div className="p-6">
                    <h3 className="font-serif text-lg font-bold text-dalfam-dark mb-4">Booking summary</h3>
                    {!selected ? (
                      <p className="text-sm text-gray-600">Select a tour to see your price.</p>
                    ) : (
                      <dl className="text-sm space-y-2 text-black">
                        <div className="flex justify-between gap-3"><dt className="text-gray-600">Tour</dt><dd className="font-medium text-right">{selected.name}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-gray-600">Starts</dt><dd>{form.startDate ? formatDate(form.startDate) : '—'}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-gray-600">Ends</dt><dd>{endDate ? formatDate(endDate) : '—'}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-gray-600">Price per person</dt><dd>{formatCurrency(selected.price)}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-gray-600">Guests</dt><dd>{guests}</dd></div>
                        <div className="flex justify-between gap-3 pt-3 mt-1 border-t border-gray-100 text-base">
                          <dt className="font-semibold">Estimated total</dt>
                          <dd className="font-bold text-dalfam-green">{formatCurrency(total)}</dd>
                        </div>
                      </dl>
                    )}
                    <p className="text-xs text-gray-500 mt-4">Final price is confirmed by our team.</p>
                  </div>
                </aside>
              </div>
            )}

            {/* STEP 3 — success */}
            {step === 3 && result && (
              <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-5">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h2 className="font-serif text-2xl font-bold text-dalfam-dark">Booking request received!</h2>
                <p className="text-black mt-2">
                  Thank you, {form.customerName.split(' ')[0]}. Our team will contact you on{' '}
                  <strong>{form.customerPhone}</strong> to confirm.
                </p>

                <div className="my-6 rounded-lg bg-dalfam-cream border border-dashed border-dalfam-gold p-5">
                  <p className="text-xs tracking-widest text-gray-600">YOUR BOOKING REFERENCE</p>
                  <p className="font-mono text-3xl font-bold text-dalfam-dark mt-1">{result.reference}</p>
                  <button type="button" onClick={copyReference} className="text-sm font-semibold text-dalfam-green hover:text-dalfam-gold mt-2">
                    {copied ? 'Copied ✓' : 'Copy reference'}
                  </button>
                </div>

                <dl className="text-sm text-left max-w-sm mx-auto space-y-2 text-black">
                  <div className="flex justify-between gap-3"><dt className="text-gray-600">Tour</dt><dd className="font-medium text-right">{result.packageName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-gray-600">Dates</dt><dd>{formatDate(result.startDate)}{result.endDate && result.endDate !== result.startDate ? ` – ${formatDate(result.endDate)}` : ''}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-gray-600">Guests</dt><dd>{result.numberOfGuests}</dd></div>
                  <div className="flex justify-between gap-3 pt-2 border-t border-gray-100"><dt className="font-semibold">Estimated total</dt><dd className="font-bold text-dalfam-green">{formatCurrency(result.totalAmount)}</dd></div>
                </dl>

                <p className="text-xs text-gray-600 mt-6">
                  Keep your reference. You can check your booking status any time under “Track My Booking”.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href={whatsappHref(`Hello DALFAM, I just made an online booking. Reference: ${result.reference} (${result.packageName}, ${result.startDate}).`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-md bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Message us on WhatsApp
                  </a>
                  <button type="button" onClick={resetBooking} className="px-5 py-2.5 rounded-md border border-dalfam-green text-dalfam-green text-sm font-semibold hover:bg-dalfam-green hover:text-white transition-colors">
                    Book another tour
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 reached without data (honeypot response) */}
            {step === 3 && !result && (
              <div className="max-w-xl mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center">
                <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-2">Thank you!</h2>
                <p className="text-black">We have received your request and will be in touch soon.</p>
              </div>
            )}
          </>
        )}

        {/* ------------------------------ TRACK TAB ------------------------------ */}
        {tab === 'track' && (
          <div className="max-w-xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-dalfam-dark mb-1">Track your booking</h2>
            <p className="text-sm text-gray-600 mb-6">Enter the reference we gave you and the phone number you booked with.</p>

            <form onSubmit={handleTrack} className="space-y-4">
              <Field label="Booking reference" required>
                <input
                  value={track.reference}
                  onChange={(e) => setTrack((t) => ({ ...t, reference: e.target.value.toUpperCase() }))}
                  className={`${inputCls} font-mono`}
                  placeholder="DAL-261007-K7M2"
                />
              </Field>
              <Field label="Phone number" required>
                <input
                  type="tel"
                  value={track.phone}
                  onChange={(e) => setTrack((t) => ({ ...t, phone: e.target.value }))}
                  className={inputCls}
                  placeholder="+255 7XX XXX XXX"
                />
              </Field>
              <button type="submit" disabled={tracking} className="w-full px-6 py-3 rounded-md bg-dalfam-green text-white font-semibold hover:bg-dalfam-dark transition-colors disabled:opacity-60">
                {tracking ? 'Checking...' : 'Check status'}
              </button>
            </form>

            {trackError && (
              <div role="alert" className="mt-5 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">{trackError}</div>
            )}

            {trackResult && (
              <div className="mt-6 rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-mono font-bold text-dalfam-dark">{trackResult.reference}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(STATUS_STYLES[trackResult.status] || {}).cls || 'bg-gray-100 text-black'}`}>
                    {(STATUS_STYLES[trackResult.status] || {}).label || trackResult.status}
                  </span>
                </div>
                <dl className="text-sm space-y-2 text-black">
                  <div className="flex justify-between gap-3"><dt className="text-gray-600">Tour</dt><dd className="font-medium text-right">{trackResult.packageName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-gray-600">Dates</dt><dd>{formatDate(trackResult.startDate)}{trackResult.endDate && trackResult.endDate !== trackResult.startDate ? ` – ${formatDate(trackResult.endDate)}` : ''}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-gray-600">Guests</dt><dd>{trackResult.numberOfGuests}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-gray-600">Total</dt><dd>{formatCurrency(trackResult.totalAmount)}</dd></div>
                </dl>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Help strip */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 text-center">
          <h2 className="font-serif text-xl font-bold text-dalfam-dark mb-2">Need help booking?</h2>
          <p className="text-black mb-5">Prefer to talk to a person? We're happy to plan your trip with you.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={whatsappHref('Hello DALFAM, I would like help booking a tour.')} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-md bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition-opacity">WhatsApp</a>
            <a href={`tel:${COMPANY_WHATSAPP_NUMBER}`} className="px-5 py-2.5 rounded-md border border-dalfam-green text-dalfam-green text-sm font-semibold hover:bg-dalfam-green hover:text-white transition-colors">Call {COMPANY_PHONE_DISPLAY}</a>
            <Link to="/contact" className="px-5 py-2.5 rounded-md border border-dalfam-green text-dalfam-green text-sm font-semibold hover:bg-dalfam-green hover:text-white transition-colors">Send a message</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dalfam-dark text-gray-300 mt-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-xl font-serif font-bold tracking-wide text-dalfam-gold">
                DALFAM
              </span>
              <span className="text-[10px] tracking-widest text-gray-400">
                COMPANY LTD
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
             A Tanzanian enterprise delivering quality livestock solutions and memorable travel experiences.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-serif font-bold text-sm tracking-wide mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-dalfam-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our divisions */}
          <div>
            <h3 className="text-white font-serif font-bold text-sm tracking-wide mb-4">
              Our Divisions
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pig-breeding" className="text-gray-400 hover:text-dalfam-gold transition-colors">
                  Pig Breeding
                </Link>
              </li>
              <li>
                <Link to="/tourism" className="text-gray-400 hover:text-dalfam-gold transition-colors">
                  Tourism
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-dalfam-gold transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-dalfam-gold transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-serif font-bold text-sm tracking-wide mb-4">
              Get In Touch
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dalfam-gold flex-shrink-0 mt-0.5">
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {COMPANY_LOCATION}
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dalfam-gold flex-shrink-0 mt-0.5">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {COMPANY_PHONE_DISPLAY}
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dalfam-gold flex-shrink-0 mt-0.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {COMPANY_EMAIL}
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" className="flex-shrink-0 mt-0.5">
                  <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.94 9.94 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2zm5.83 14.24c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11a16.6 16.6 0 0 1-1.62-.6c-2.86-1.24-4.72-4.13-4.86-4.32-.14-.19-1.16-1.54-1.16-2.94s.73-2.09 1-2.38c.26-.29.57-.36.76-.36l.55.01c.17.01.41-.07.64.49.24.58.81 2 .88 2.15.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.15.46.13.63-.08.17-.21.72-.84.91-1.13.19-.29.38-.24.64-.14.26.1 1.66.78 1.94.92.29.14.48.21.55.33.07.12.07.68-.17 1.36z" />
                </svg>
                <a href={whatsappHref('Hello DALFAM, I would like to get more information about your services.')} target="_blank" rel="noopener noreferrer" className="hover:text-dalfam-gold transition-colors">
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social + copyright bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} DALFAM Company Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-dalfam-gold hover:border-dalfam-gold transition-colors"
                >
                  {s.label === 'Facebook' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5H17V3.7C16.4 3.6 15.4 3.5 14.2 3.5c-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13H10v8h3.5z" />
                    </svg>
                  )}
                  {s.label === 'Instagram' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  )}
                  {s.label === 'YouTube' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12s0-3.2-.4-4.6a2.6 2.6 0 0 0-1.9-1.9C18.3 5 12 5 12 5s-6.3 0-7.7.5a2.6 2.6 0 0 0-1.9 1.9C2 8.8 2 12 2 12s0 3.2.4 4.6a2.6 2.6 0 0 0 1.9 1.9C5.7 19 12 19 12 19s6.3 0 7.7-.5a2.6 2.6 0 0 0 1.9-1.9c.4-1.4.4-4.6.4-4.6zM10 15.5v-7l6 3.5-6 3.5z" />
                    </svg>
                  )}
                  {s.label === 'LinkedIn' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.9 8.5H3.6V20h3.3V8.5zM5.3 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 20h-3.3v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V20H9.5V8.5h3.2v1.6h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5V20z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
