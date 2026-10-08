import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/tourism-hero.jpg';
import api from '../api/axios';
import { getAssetUrl, formatCurrency } from '../utils/format';
import Navbar, { NAV_LINKS } from '../components/Navbar';

// Put actual files in frontend/public/images/ using these names, or edit
// the paths to match your own file names.
const EXPERIENCES = [
  {
    title: 'Wildlife Safaris',
    image: '/images/experience-safari.jpg',
    text: 'Guided game drives through Tanzania\'s national parks, with experienced local guides and small, personal groups.',
  },
  {
    title: 'Cultural Tours',
    image: '/images/experience-cultural.jpg',
    text: 'Visit local communities, markets and heritage sites — travel that respects and supports the people who live there.',
  },
  {
    title: 'Mountain & Nature Trails',
    image: '/images/experience-nature.jpg',
    text: 'Hiking and nature excursions across Tanzania\'s highlands, forests and lakeshores, suited to all fitness levels.',
  },
  {
    title: 'Farm Stays',
    image: '/images/water.jpg',
    text: 'Stay close to DALFAM\'s own farms and see Tanzanian livestock production up close, alongside your travel itinerary.',
  },
];

const PACKAGES = [
  {
    name: 'Weekend Explorer',
    duration: '2 Days / 1 Night',
    image: '/images/package-weekend.jpg',
    text: 'A short, easy introduction to the region — one guided excursion, comfortable lodging and all meals included.',
  },
  {
    name: 'Highlands & Heritage',
    duration: '5 Days / 4 Nights',
    image: '/images/package-highlands.jpg',
    text: 'A fuller journey combining nature trails, cultural visits and a farm-stay experience with DALFAM.',
  },
  {
    name: 'Custom Itinerary',
    duration: 'Flexible',
    image: '/images/package-custom.jpg',
    text: 'Tell us what you want to see and do, and we will design a private itinerary around your schedule and budget.',
  },
];

// ---------------------------------------------------------------------------
// EDITABLE CONTENT — additional tourism-related information shown on this
// page. Update the values below with real DALFAM figures/details.
// ---------------------------------------------------------------------------

// Quick stats about the tourism operation.
const TOURISM_STATS = [
  { value: '10+', label: 'Years Operating' },
  { value: '1,000+', label: 'Travellers Hosted' },
  { value: '12+', label: 'Destinations Covered' },
  { value: '4.8/5', label: 'Average Guest Rating' },
];

// Certifications and licenses relevant to the tourism business.
const TOURISM_CERTIFICATIONS = [
  'Tourism Operator License — Tanzania Tourist Board',
  'Registered Company — Tanzania Business Registration and Licensing Agency (BRELA)',
  'Member — Tanzania Tour Operators Association',
  'Certified Guide & Guest Safety Standards',
];

// Photos of past tours and destinations.
// Put actual files in frontend/public/images/ using these names, or edit
// the paths to match your own file names.
const TOURISM_GALLERY = [
  { src: '/images/gallery-4.jpg', alt: 'Guided safari tour' },
  { src: '/images/gallery-5.jpg', alt: 'Cultural tourism visit' },
  { src: '/images/hero-pig-breeding.jpg', alt: 'Farm stay experience' },
];

// Testimonials from past travellers.
const TOURISM_TESTIMONIALS = [
  {
    quote: 'Our safari with DALFAM was personal and well organised from start to finish. It felt like travelling with friends who know the land.',
    name: 'Traveller Name',
    role: 'Visitor from Kenya',
  },
  {
    quote: 'The cultural tour gave us a real connection to the communities we visited, not just a quick photo stop. Highly recommended.',
    name: 'Traveller Name',
    role: 'Visitor from the UK',
  },
  {
    quote: 'Booking was easy, the guide was knowledgeable, and the farm stay was a highlight none of the usual tours offer.',
    name: 'Traveller Name',
    role: 'Visitor from South Africa',
  },
];

// Frequently asked questions specific to booking a tour.
const TOURISM_FAQS = [
  {
    q: 'Can you design a custom itinerary?',
    a: 'Yes. Tell us where you want to go and what you want to experience, and our team will design a private itinerary around your schedule and budget.',
  },
  {
    q: 'What should I pack for a trip?',
    a: 'Light, breathable clothing, comfortable walking shoes, sun protection and a light jacket for cooler evenings. We share a detailed packing list once your trip is confirmed.',
  },
  {
    q: 'Do you arrange airport transfers?',
    a: 'Yes, airport pickup and drop-off can be arranged as part of your package — just let us know your flight details when booking.',
  },
  {
    q: 'Is travel insurance included?',
    a: 'Travel insurance is not included in our packages. We recommend travellers arrange their own cover before departure.',
  },
];

// Tourism office contact details, shown in the footer.
const TOURISM_OFFICE_LOCATION = {
  name: 'Tourism Office',
  address: 'Arusha, Tanzania',
  phone: '+255 718 258 199',
};
const COMPANY_EMAIL = 'info@dalfam.co.tz';

// Social media links. Replace with real URLs, or remove a line to hide it.
const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/' },
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'YouTube', href: 'https://youtube.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
];

// Generic photo (gallery / packages) with a neutral placeholder fallback so
// the layout never breaks before real photos are uploaded.
function ImageWithFallback({ src, alt, className = '', iconSize = '40%' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
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

const CATEGORY_LABELS = {
  nature: 'Nature',
  cultural: 'Cultural',
  corporate: 'Corporate',
  custom: 'Custom',
};

export default function Tourism() {
  const [openFaq, setOpenFaq] = useState(-1);

  // Tour packages uploaded by the admin (photo, price, category, etc.),
  // shown publicly on this page. Expects a public endpoint such as
  // GET /packages/public returning active, admin-approved packages with
  // imageUrl.
  const [tours, setTours] = useState([]);
  const [toursLoading, setToursLoading] = useState(true);
  const [toursError, setToursError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadTours = async () => {
      setToursLoading(true);
      setToursError(false);
      try {
        const { data } = await api.get('/packages/public');
        if (!cancelled) setTours(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load tourism packages:', err);
        if (!cancelled) setToursError(true);
      } finally {
        if (!cancelled) setToursLoading(false);
      }
    };

    loadTours();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-dalfam-cream">
      <Navbar active="Tourism" />
{/* Page hero */}
<section className="relative text-white overflow-hidden min-h-[350px] md:min-h-[430px]">
  {/* Image only: no overlay, no tint, no opacity */}
  <img
    src={heroImage}
    alt="DALFAM Tourism"
  className="absolute inset-0 w-full h-full object-cover object-[center_65%]"
  />

  <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
    <h1
      className="font-serif font-bold text-4xl sm:text-5xl"
      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
    >
      DALFAM Tourism
    </h1>
    <p
      className="mt-5 text-lg text-white max-w-2xl mx-auto"
      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
    >
      Curated Tanzanian travel experiences connecting visitors with nature, culture, and local communities.
    </p>
  </div>
</section>

     {/* Experiences */}
<section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
  <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-10 text-center">
    Experiences We Offer
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
    {EXPERIENCES.map((e) => (
      <div
        key={e.title}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col w-full"
      >
        {/* Square image */}
        <div className="aspect-square w-full">
          <ImageWithFallback
            src={e.image}
            alt={e.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-serif text-lg font-bold text-dalfam-green mb-2">
            {e.title}
          </h3>
          <p className="text-black text-sm leading-relaxed">{e.text}</p>
        </div>
      </div>
    ))}
  </div>
</section>

{/* Tourism stats */}
<section className="bg-dalfam-green text-white">
  <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    {TOURISM_STATS.map((d) => (
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
     {/* Packages (marketing overview) */}
<section className="bg-white border-y border-gray-200">
  <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-10 text-center">
      Travel Packages
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
      {PACKAGES.map((p) => (
        <div
          key={p.name}
          className="rounded-lg border border-gray-200 overflow-hidden flex flex-col w-full bg-white"
        >
          {/* Square image */}
          <div className="aspect-square w-full">
            <ImageWithFallback
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-serif text-lg font-bold text-dalfam-dark mb-1">
              {p.name}
            </h3>
            <span className="text-xs tracking-widest text-dalfam-gold font-semibold mb-3">
              {p.duration}
            </span>
            <p className="text-black text-sm leading-relaxed flex-1">{p.text}</p>
            <Link
              to="/contact"
              className="inline-block mt-5 text-dalfam-green font-medium hover:text-dalfam-gold transition-colors"
            >
              Enquire →
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Available Tour Packages — live data + photos uploaded by the admin */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-3 text-center">
          Available Tour Packages
        </h2>
        <p className="text-black text-center max-w-2xl mx-auto mb-12">
          A current look at tours we're running, with photos and pricing kept
          up to date by our team.
        </p>

        {toursLoading && (
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

        {!toursLoading && toursError && (
          <p className="text-center text-black">
            We couldn't load tour packages right now. Please check back soon,
            or{' '}
            <Link to="/contact" className="text-dalfam-green font-medium hover:text-dalfam-gold">
              contact us
            </Link>{' '}
            directly for current availability.
          </p>
        )}

        {!toursLoading && !toursError && tours.length === 0 && (
          <p className="text-center text-black">
            No tour packages listed publicly at the moment. Please{' '}
            <Link to="/contact" className="text-dalfam-green font-medium hover:text-dalfam-gold">
              contact us
            </Link>{' '}
            to ask about current availability.
          </p>
        )}

        {!toursLoading && !toursError && tours.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="rounded-lg border border-gray-200 overflow-hidden bg-white"
              >
                <ImageWithFallback
                  src={tour.imageUrl ? getAssetUrl(tour.imageUrl) : null}
                  alt={tour.name}
                  className="w-full h-56"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-serif text-base font-bold text-dalfam-dark">
                      {tour.name}
                    </h3>
                    {tour.category && (
                      <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full flex-shrink-0 bg-dalfam-green/10 text-dalfam-green">
                        {CATEGORY_LABELS[tour.category] || tour.category}
                      </span>
                    )}
                  </div>
                  {tour.description && (
                    <p className="text-sm text-black mb-2 line-clamp-2">
                      {tour.description}
                    </p>
                  )}
                  <p className="text-xs text-black mb-1">
                    {tour.durationDays} day(s) · Up to {tour.maxGuests} guests
                  </p>
                  <p className="text-sm font-semibold text-dalfam-dark mt-1">
                    {formatCurrency(tour.price)}
                  </p>
                  <Link
                    to={`/book?package=${tour.id}`}
                    className="mt-4 block text-center px-4 py-2 rounded-md bg-dalfam-green text-white text-sm font-semibold hover:bg-dalfam-dark transition-colors"
                  >
                    Book This Tour
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/book"
            className="inline-block px-6 py-3 rounded-md bg-dalfam-gold text-dalfam-dark font-semibold hover:bg-yellow-500 transition-colors"
          >
            Book Online
          </Link>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 rounded-md border border-dalfam-green text-dalfam-green font-semibold hover:bg-dalfam-green hover:text-white transition-colors"
          >
            Enquire About Availability
          </Link>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-6 text-center">
            Certifications & Licenses
          </h2>
          <p className="text-black text-center max-w-2xl mx-auto mb-10">
            Our tourism operation is registered and licensed, so travellers
            can book with confidence.
          </p>
          <ul className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {TOURISM_CERTIFICATIONS.map((c) => (
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
    Moments From The Road
  </h2>
  <p className="text-black text-center max-w-2xl mx-auto mb-12">
    A look at past tours, destinations and the guests we've hosted
    across Tanzania.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {TOURISM_GALLERY.map((g, i) => {
      // Hardcoded titles, matched to images by position
      const title = [
        'Safari Adventures',
        'Scenic Destinations',
        'Our Happy Guests',
      ][i] || g.alt;

      return (
        <figure
          key={g.src}
          className="rounded-lg border border-gray-200 overflow-hidden bg-white"
        >
          {/* Square image */}
          <div className="aspect-square w-full">
            <ImageWithFallback
              src={g.src}
              alt={g.alt || title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hardcoded title */}
          <figcaption className="px-3 py-3 text-center border-t border-gray-200">
            <span className="block font-serif text-sm md:text-base font-semibold text-dalfam-dark leading-snug">
              {title}
            </span>
          </figcaption>
        </figure>
      );
    })}
  </div>
</section>
      {/* Testimonials */}
      <section className="bg-dalfam-dark text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl font-bold mb-12 text-center">
            What Travellers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TOURISM_TESTIMONIALS.map((t) => (
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
          {TOURISM_FAQS.map((f, i) => (
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
            Plan your trip to Tanzania
          </h2>
          <p className="text-black mb-8 max-w-xl mx-auto">
            Tell us where you want to go and what you want to experience, and
            our team will put together an itinerary for you.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 rounded-md bg-dalfam-gold text-dalfam-dark font-semibold hover:bg-yellow-500 transition-colors"
          >
            Contact Us
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
                {TOURISM_OFFICE_LOCATION.address}
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dalfam-gold flex-shrink-0 mt-0.5">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {TOURISM_OFFICE_LOCATION.phone}
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
