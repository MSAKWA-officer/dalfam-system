import React from 'react';
import { Link } from 'react-router-dom';
import Navbar, { NAV_LINKS } from '../components/Navbar';
// ---------------------------------------------------------------------------
// HOME PAGE IMAGES — every image on this page has its OWN entry below.
// Nothing here is shared with the hero image or with the other pages, so you
// can change any one of them without affecting the rest.
// Files live in: frontend/public/images/  (reference them as '/images/<file>')
// ---------------------------------------------------------------------------
const HOME_IMAGES = {
  // Top hero banner (background)
  hero: '/images/hero.PNG',

  // "What We Do" cards
  pigBreedingCard: '/images/hero-pig-breeding.jpg',
  tourismCard: '/images/tourism-hero.jpg',

  // "From Our Blog" preview cards (one image per post)
  blogPost1: '/images/gallery-2.jpg',
  blogPost2: '/images/twiga.PNG',
  blogPost3: '/images/gallery-3.jpg',
};

// Snapshot numbers shown in the stats strip. Edit these to match real figures.

// Footer / contact details — keep in sync with the other pages.
const COMPANY_PHONE_DISPLAY = '+255 718 258 199';
const COMPANY_WHATSAPP_NUMBER = '255 718 258 199';
const COMPANY_EMAIL = 'info@dalfam.co.tz';
const COMPANY_LOCATION = 'Mbeya, Tanzania';
const WHATSAPP_DEFAULT_MESSAGE =
  'Hello DALFAM, I would like to get more information about your services.';

// Social media links. Replace with real URLs, or remove a line to hide it.
const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/' },
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'YouTube', href: 'https://youtube.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
];

const STATS = [
  { value: '10+', label: 'Years of Experience' },
  { value: '500+', label: 'Farmers Supported' },
  { value: '1,200+', label: 'Pigs Bred & Delivered' },
  { value: '300+', label: 'Travellers Hosted' },
];

const BREEDING_SERVICES = [
  'Genetic improvement & healthy breeding lines',
  'Herd development for new and growing farms',
  'Biosecurity & disease-prevention practices',
  'Production support: feeding, health, management',
  'Market access & buyer connections',
  'Practical, on-farm farmer training',
];

const TOURISM_EXPERIENCES = [
  'Guided wildlife safaris in small groups',
  'Cultural tours with local communities',
  'Mountain & nature trail excursions',
  'Farm-stay experiences at DALFAM farms',
];

const PROCESS = [
  { step: '1', title: 'Consultation', text: 'We learn your goals — a farmer\u2019s herd plan or a traveller\u2019s itinerary.' },
  { step: '2', title: 'Tailored Plan', text: 'You get matched with the right stock, package or route for your needs.' },
  { step: '3', title: 'Delivery & Setup', text: 'We handle transport, logistics and on-the-ground arrangements.' },
  { step: '4', title: 'Ongoing Support', text: 'Continued guidance long after the sale or the trip is booked.' },
];

const VALUES = [
  { title: 'Quality', text: 'Every animal, every guest experience and every record held to a high standard.' },
  { title: 'Integrity', text: 'Honest dealings with farmers, partners and visitors — fair prices, clear records.' },
  { title: 'Community', text: 'We grow by helping local farmers and communities grow with us.' },
  { title: 'Sustainability', text: 'Livestock and tourism that respect the land, the animals and the people.' },
];

const BLOG_PREVIEW = [
  {
    title: 'Choosing the Right Breeding Stock for Your Farm',
    excerpt: 'A practical look at what to check before you bring new pigs onto your land.',
    tag: 'Pig Breeding',
    image: HOME_IMAGES.blogPost1,
  },
  {
    title: 'Five Tanzanian Trails Worth the Hike',
    excerpt: 'From highland forests to lakeshore paths, a guide to our favourite nature routes.',
    tag: 'Tourism',
    image: HOME_IMAGES.blogPost2,
  },
  {
    title: 'Biosecurity Basics Every Farmer Should Know',
    excerpt: 'Simple, affordable habits that protect your herd from disease year-round.',
    tag: 'Pig Breeding',
    image: HOME_IMAGES.blogPost3,
  },
];

export default function Home() {
  const whatsappHref = `https://wa.me/${COMPANY_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_DEFAULT_MESSAGE
  )}`;

  return (
    <div className="min-h-screen bg-dalfam-cream">
      <Navbar active="Home" />

  {/* Hero */}
<section className="relative overflow-hidden min-h-[320px] md:min-h-[400px] flex items-center">
  {/* Image only — no color overlay */}

 <img
  src={HOME_IMAGES.hero}
  alt="DALFAM"
 className="absolute inset-0 w-full h-full object-cover object-[center_75%]"
/>

  <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 md:py-16 text-center w-full text-white">
    <span
      className="inline-block text-xs tracking-widest text-dalfam-gold font-semibold mb-4"
      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
    >
      DALFAM COMPANY LTD &middot; TANZANIA
    </span>

    <h1
      className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl leading-tight"
      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
    >
      Together for a Greater Tomorrow
    </h1>

    <p
      className="mt-6 text-lg text-white max-w-2xl mx-auto"
      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
    >
      A diversified Tanzanian enterprise delivering quality livestock systems and exceptional travel experiences.
    </p>

    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <Link
        to="/pig-breeding"
        className="px-6 py-3 rounded-md bg-dalfam-gold text-dalfam-dark font-semibold shadow-lg hover:bg-yellow-500 transition-colors"
      >
        Pig Breeding
      </Link>
      <Link
        to="/tourism"
        className="px-6 py-3 rounded-md border border-white text-white font-semibold shadow-lg hover:bg-white hover:text-dalfam-dark transition-colors"
      >
        Tourism
      </Link>
      <Link
        to="/contact"
        className="px-6 py-3 rounded-md border border-white/60 text-white font-semibold shadow-lg hover:border-white transition-colors"
      >
        Contact Us
      </Link>
    </div>
  </div>
</section>

      {/* Stats strip */}
      <section className="bg-dalfam-green text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-3xl md:text-4xl font-bold text-dalfam-gold">
                {s.value}
              </p>
              <p className="mt-1 text-xs md:text-sm tracking-wide text-gray-200">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About snippet */}
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-dalfam-dark mb-4">
          Who We Are
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
          DALFAM Company Ltd is a Tanzanian enterprise built on two things we
          believe belong together: disciplined livestock production and
          memorable travel experiences. From genetic improvement and herd
          health on the farm, to guided safaris and cultural tours across the
          country, everything we do is held to the same standard of quality,
          integrity and community impact.
        </p>
        <Link
          to="/about"
          className="inline-block mt-5 text-dalfam-green font-medium hover:text-dalfam-gold transition-colors"
        >
          More About DALFAM &rarr;
        </Link>
      </section>

      {/* Two pillars, now with service details */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-dalfam-dark mb-3 text-center">
            What We Do
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Two specialized divisions, united under one company and driven by expertise, quality, and shared standards.

          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={HOME_IMAGES.pigBreedingCard}
                alt="DALFAM Pig Breeding"
                className="w-full h-56 object-cover"
              />
              <div className="p-8">
              <h3 className="font-serif text-2xl font-bold text-dalfam-dark mb-3">
                DALFAM Pig Breeding
              </h3>
              <p className="text-gray-600 leading-relaxed mb-5">
                Commercial breeding, genetic improvement, herd development,
                biosecurity, production support and market-oriented livestock
                solutions for farmers across Tanzania.
              </p>
              <ul className="space-y-2 mb-6">
                {BREEDING_SERVICES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-dalfam-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/pig-breeding"
                className="inline-block text-dalfam-green font-medium hover:text-dalfam-gold transition-colors"
              >
                Learn more about Pig Breeding &rarr;
              </Link>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={HOME_IMAGES.tourismCard}
                alt="DALFAM Tourism"
                className="w-full h-56 object-cover"
              />
              <div className="p-8">
              <h3 className="font-serif text-2xl font-bold text-dalfam-dark mb-3">
                DALFAM Tourism
              </h3>
              <p className="text-gray-600 leading-relaxed mb-5">
                Tourism experiences, destination partnerships, curated travel
                and cultural experiences that showcase the best of Tanzania.
              </p>
              <ul className="space-y-2 mb-6">
                {TOURISM_EXPERIENCES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-dalfam-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/tourism"
                className="inline-block text-dalfam-green font-medium hover:text-dalfam-gold transition-colors"
              >
                Learn more about Tourism &rarr;
              </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-dalfam-dark mb-10 text-center">
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
              <p className="text-gray-600 text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-dalfam-dark mb-10 text-center">
            What Guides Us
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((v) => (
              <div key={v.title}>
                <h3 className="font-serif text-lg font-bold text-dalfam-green mb-2">
                  {v.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Blog preview */}
<section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
  <div className="flex items-center justify-between mb-10">
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-dalfam-dark">
      From Our Blog
    </h2>
    <Link
      to="/blog"
      className="text-sm text-dalfam-green font-medium hover:text-dalfam-gold transition-colors hidden sm:inline-block"
    >
      View all posts &rarr;
    </Link>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
    {BLOG_PREVIEW.map((post) => (
      <div
        key={post.title}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col w-full"
      >
        {/* Square image */}
        <div className="aspect-square w-full">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 flex flex-col flex-1">
          <span className="text-xs tracking-widest text-dalfam-gold font-semibold mb-3">
            {post.tag.toUpperCase()}
          </span>
          <h3 className="font-serif text-lg font-bold text-dalfam-dark mb-2">
            {post.title}
          </h3>
          <p className="text-black text-sm leading-relaxed flex-1">
            {post.excerpt}
          </p>
          <Link
            to="/blog"
            className="inline-block mt-5 text-dalfam-green font-medium hover:text-dalfam-gold transition-colors"
          >
            Read more &rarr;
          </Link>
        </div>
      </div>
    ))}
  </div>

  <Link
    to="/blog"
    className="mt-8 inline-block sm:hidden text-sm text-dalfam-green font-medium hover:text-dalfam-gold transition-colors"
  >
    View all posts &rarr;
  </Link>
</section>

      {/* Final CTA */}
      <section className="bg-dalfam-dark text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
            Let's Work Together
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            From quality breeding stock to unforgettable Tanzanian travel experiences, DALFAM provides trusted solutions for farmers and travellers.

          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-md bg-dalfam-gold text-dalfam-dark font-semibold hover:bg-yellow-500 transition-colors"
            >
              Contact Our Team
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 rounded-md border border-white text-white font-semibold hover:bg-white hover:text-dalfam-dark transition-colors"
            >
              About DALFAM
            </Link>
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
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-dalfam-gold transition-colors">
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
