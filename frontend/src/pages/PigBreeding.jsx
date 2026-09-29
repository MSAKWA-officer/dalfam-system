import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getAssetUrl } from '../utils/format';
import Navbar, { NAV_LINKS } from '../components/Navbar';

const SERVICES = [
  {
    title: 'Genetic Improvement',
    text: 'Carefully selected breeding lines to improve growth rate, litter size and overall herd quality.',
  },
  {
    title: 'Herd Development',
    text: 'Support for farmers building a herd from scratch — starter stock, housing guidance and planning.',
  },
  {
    title: 'Biosecurity',
    text: 'Disease-prevention practices that protect your investment and keep herds healthy year-round.',
  },
  {
    title: 'Production Support',
    text: 'Ongoing technical guidance on feeding, health and management to keep production efficient.',
  },
  {
    title: 'Market Access',
    text: 'Connecting farmers to buyers and market-ready pricing, so good breeding translates to income.',
  },
  {
    title: 'Training',
    text: 'Practical, on-farm training for new and experienced farmers on modern pig-rearing methods.',
  },
];

const PROCESS = [
  { step: '1', title: 'Consultation', text: 'We assess your farm, goals and budget to recommend the right breeding stock.' },
  { step: '2', title: 'Stock Selection', text: 'You choose from healthy, genetically strong breeding pigs matched to your needs.' },
  { step: '3', title: 'Delivery & Setup', text: 'We help with transport, housing checks and settling the animals into your farm.' },
  { step: '4', title: 'Ongoing Support', text: 'Continued guidance on health, feeding and production as your herd grows.' },
];

// ---------------------------------------------------------------------------
// EDITABLE CONTENT — additional breeding-related information shown on this
// page. Update the values below with real DALFAM figures/details.
// ---------------------------------------------------------------------------

// Quick stats about the breeding operation.
const BREEDING_STATS = [
  { value: '10+', label: 'Years Breeding' },
  { value: '500+', label: 'Farmers Supported' },
  { value: '15+', label: 'Breeding Lines' },
  { value: '98%', label: 'Herd Health Rate' },
];

// Certifications and licenses relevant to the breeding business.
const BREEDING_CERTIFICATIONS = [
  'Livestock Breeding License — Ministry of Livestock and Fisheries',
  'Registered Company — Tanzania Business Registration and Licensing Agency (BRELA)',
  'Member — Tanzania Pig Farmers Association',
  'Certified Biosecurity Standards Compliance',
];

// Photos of the breeding farm and herd.
// Put actual files in frontend/public/images/ using these names, or edit
// the paths to match your own file names.
const BREEDING_GALLERY = [
  { src: '/images/hero-pig-breeding.jpg', alt: 'DALFAM breeding farm' },
  { src: '/images/gallery-2.jpg', alt: 'Pig herd on the farm' },
  { src: '/images/gallery-3.jpg', alt: 'Farmer training session' },
];

// Testimonials from farmers who bought breeding stock.
const BREEDING_TESTIMONIALS = [
  {
    quote: 'DALFAM gave me healthy breeding stock and kept supporting me even after the sale. My herd has never been stronger.',
    name: 'Farmer Name',
    role: 'Pig Farmer, Morogoro',
  },
  {
    quote: 'The training I received on biosecurity changed how I run my farm. Fewer losses, healthier pigs, better income.',
    name: 'Farmer Name',
    role: 'Pig Farmer, Iringa',
  },
  {
    quote: 'Their genetic selection really shows — growth rates and litter sizes have improved noticeably since I switched to DALFAM stock.',
    name: 'Farmer Name',
    role: 'Pig Farmer, Dodoma',
  },
];

// Frequently asked questions specific to buying/keeping breeding stock.
const BREEDING_FAQS = [
  {
    q: 'What breeds does DALFAM offer?',
    a: 'We offer genetically improved breeding lines selected for growth rate, litter size and overall herd quality. Contact us for current availability.',
  },
  {
    q: 'Do you offer support after purchase?',
    a: 'Yes. Every purchase includes ongoing technical guidance on feeding, health and management as your herd grows.',
  },
  {
    q: 'Can I visit the breeding farm before buying?',
    a: 'Yes, farm visits can be arranged as part of our consultation process — contact us to schedule one.',
  },
  {
    q: 'How is stock transported to my farm?',
    a: 'We help coordinate transport and housing checks as part of the delivery and setup process described in How It Works below.',
  },
];

// Breeding farm contact details, shown in the footer.
const BREEDING_FARM_LOCATION = {
  name: 'Breeding Farm',
  address: 'Morogoro Region, Tanzania',
  phone: '+255 XXX XXX XXX',
};
const COMPANY_EMAIL = 'info@dalfam.co.tz';

// Social media links. Replace with real URLs, or remove a line to hide it.
const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/' },
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'YouTube', href: 'https://youtube.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
];

// Put the image file at: frontend/public/images/hero-pig-breeding.jpg
// (change this path if you name the file differently)
const HERO_IMAGE = '/images/hero-pig-breeding.jpg';

// Shows a photo uploaded by the admin, or a neutral placeholder icon while
// the image is loading or if no photo has been uploaded yet — so the layout
// never breaks.
function AnimalPhoto({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-dalfam-green/10 text-dalfam-green ${className}`} aria-label={alt}>
        <svg width="36%" height="36%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 13c0-3.9 3.6-7 8-7s8 3.1 8 7-3.6 6-8 6-8-2.1-8-6z" />
          <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
          <path d="M11 15.5c.6.4 1.4.4 2 0" strokeLinecap="round" />
          <path d="M4 11l-2-1.5M20 11l2-1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

// Generic photo (gallery / partners) with a neutral placeholder fallback.
function ImageWithFallback({ src, alt, className = '', iconSize = '40%' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-dalfam-green/10 text-dalfam-green ${className}`}
        aria-label={alt}
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="M21 16l-5.5-5-4 4-2-2L3 18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-serif font-bold text-dalfam-dark">{q}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`flex-shrink-0 text-dalfam-green transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 pb-4 text-black text-sm leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700',
  quarantine: 'bg-yellow-100 text-yellow-700',
  sold: 'bg-gray-200 text-gray-700',
  deceased: 'bg-gray-200 text-gray-500',
};

export default function PigBreeding() {
  const [openFaq, setOpenFaq] = useState(-1);

  // Breeding stock uploaded by the admin (photo, tag, breed, etc.), shown
  // publicly on this page. Expects a public endpoint such as
  // GET /breeding-stock/public returning available animals with imageUrl.
  const [animals, setAnimals] = useState([]);
  const [animalsLoading, setAnimalsLoading] = useState(true);
  const [animalsError, setAnimalsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadAnimals = async () => {
      setAnimalsLoading(true);
      setAnimalsError(false);
      try {
        const { data } = await api.get('/breeding-stock/public');
        if (!cancelled) setAnimals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load breeding stock:', err);
        if (!cancelled) setAnimalsError(true);
      } finally {
        if (!cancelled) setAnimalsLoading(false);
      }
    };

    loadAnimals();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-dalfam-cream">
      <Navbar active="Pig Breeding" />

      {/* Page hero */}
      <section className="relative text-white overflow-hidden min-h-[360px] md:min-h-[420px] flex items-center bg-dalfam-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(234, 243, 241, 0.85) 0%, rgba(18,36,31,0.6) 50%, rgba(18,36,31,0.92) 100%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center w-full">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl">
            DALFAM Pig Breeding
          </h1>
          <p className="mt-5 text-lg text-gray-200 max-w-2xl mx-auto">
            Commercial breeding, genetic improvement and production support
            that helps Tanzanian farmers build healthy, market-ready herds.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-8 px-6 py-3 rounded-md bg-dalfam-gold text-dalfam-dark font-semibold hover:bg-yellow-500 transition-colors"
          >
            Request Breeding Stock
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-3 text-center">
          Our Breeding Services
        </h2>
        <p className="text-black text-center max-w-2xl mx-auto mb-12">
          Everything a farmer needs to start or grow a productive pig
          herd — from healthy genetics to ongoing technical support.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="font-serif text-lg font-bold text-dalfam-dark mb-2">
                {s.title}
              </h3>
              <p className="text-black text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Breeding stats */}
      <section className="bg-dalfam-green text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {BREEDING_STATS.map((d) => (
            <div key={d.label}>
              <p className="font-serif text-3xl md:text-4xl font-bold text-dalfam-gold">
                {d.value}
              </p>
              <p className="mt-1 text-xs md:text-sm tracking-wide text-gray-200">
                {d.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Breeding Stock — live data + photos uploaded by the admin */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-3 text-center">
            Our Breeding Stock
          </h2>
          <p className="text-black text-center max-w-2xl mx-auto mb-12">
            A current look at animals available on our farm, with photos and
            details kept up to date by our team.
          </p>

          {animalsLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                  <div className="w-full h-56 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!animalsLoading && animalsError && (
            <p className="text-center text-black">
              We couldn't load breeding stock right now. Please check back
              soon, or{' '}
              <Link to="/contact" className="text-dalfam-green font-medium hover:text-dalfam-gold">
                contact us
              </Link>{' '}
              directly for current availability.
            </p>
          )}

          {!animalsLoading && !animalsError && animals.length === 0 && (
            <p className="text-center text-black">
              No breeding stock listed publicly at the moment. Please{' '}
              <Link to="/contact" className="text-dalfam-green font-medium hover:text-dalfam-gold">
                contact us
              </Link>{' '}
              to ask about current availability.
            </p>
          )}

          {!animalsLoading && !animalsError && animals.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.map((animal) => (
                <div
                  key={animal.id}
                  className="rounded-lg border border-gray-200 overflow-hidden bg-white"
                >
                  <AnimalPhoto
                    src={animal.imageUrl ? getAssetUrl(animal.imageUrl) : null}
                    alt={animal.name || animal.tagNumber}
                    className="w-full h-56"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif text-base font-bold text-dalfam-dark">
                        {animal.name || animal.tagNumber}
                      </h3>
                      {animal.status && (
                        <span
                          className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                            STATUS_STYLES[animal.status] || 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {animal.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-black mb-1">
                      Tag: {animal.tagNumber}
                    </p>
                    <p className="text-sm text-black">
                      {animal.breed}
                      {animal.sex ? ` \u00b7 ${animal.sex === 'female' ? 'Female' : 'Male'}` : ''}
                    </p>
                    {animal.weightKg && (
                      <p className="text-sm text-black mt-1">
                        {animal.weightKg} kg
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/contact"
              className="inline-block px-6 py-3 rounded-md bg-dalfam-gold text-dalfam-dark font-semibold hover:bg-yellow-500 transition-colors"
            >
              Enquire About Availability
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-10 text-center">
          How It Works
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS.map((p) => (
            <div key={p.step}>
              <div className="w-10 h-10 rounded-full bg-dalfam-green text-white flex items-center justify-center font-serif font-bold mb-4">
                {p.step}
              </div>
              <h3 className="font-serif text-base font-bold text-dalfam-dark mb-2">
                {p.title}
              </h3>
              <p className="text-black text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-6 text-center">
            Certifications & Licenses
          </h2>
          <p className="text-black text-center max-w-2xl mx-auto mb-10">
            Our breeding operation is registered and licensed, so farmers can
            buy with confidence.
          </p>
          <ul className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {BREEDING_CERTIFICATIONS.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm text-black">
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className="text-dalfam-gold flex-shrink-0 mt-0.5"
                >
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-3 text-center">
          Life On The Breeding Farm
        </h2>
        <p className="text-black text-center max-w-2xl mx-auto mb-12">
          A look at our herds, facilities and the farmers we train and
          support.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BREEDING_GALLERY.map((g) => (
            <ImageWithFallback
              key={g.src}
              src={g.src}
              alt={g.alt}
              className="w-full h-52 rounded-lg"
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-dalfam-dark text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl font-bold mb-12 text-center">
            What Farmers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {BREEDING_TESTIMONIALS.map((t) => (
              <div
                key={t.name + t.role}
                className="bg-white/5 border border-white/10 rounded-lg p-6"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-dalfam-gold mb-4">
                  <path d="M7 11c0-3 2-5 5-5v2c-1.7 0-3 1.3-3 3h3v6H7v-6zm9 0c0-3 2-5 5-5v2c-1.7 0-3 1.3-3 3h3v6h-5v-6z" />
                </svg>
                <p className="text-gray-200 text-sm leading-relaxed mb-5">
                  {t.quote}
                </p>
                <p className="font-serif font-bold text-white text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {BREEDING_FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 text-center">
          <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-3">
            Ready to strengthen your herd?
          </h2>
          <p className="text-black mb-8 max-w-xl mx-auto">
            Talk to our breeding team about your farm's goals and get
            matched with the right stock for your budget and land.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 rounded-md bg-dalfam-gold text-dalfam-dark font-semibold hover:bg-yellow-500 transition-colors"
          >
            Contact Our Team
          </Link>
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
              A Tanzanian enterprise building productive livestock systems and
              memorable travel experiences — two industries, one standard of
              quality.
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
                {BREEDING_FARM_LOCATION.address}
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dalfam-gold flex-shrink-0 mt-0.5">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {BREEDING_FARM_LOCATION.phone}
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dalfam-gold flex-shrink-0 mt-0.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {COMPANY_EMAIL}
              </li>
            </ul>
          </div>
        </div>

        {/* Social + copyright bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} DALFAM Company Ltd. Haki zote zimehifadhiwa.
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
