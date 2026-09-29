import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar, { NAV_LINKS } from '../components/Navbar';

const VALUES = [
  {
    title: 'Quality',
    text: 'Every animal, every guest experience and every record is held to a standard we would put our own name behind.',
  },
  {
    title: 'Integrity',
    text: 'We deal honestly with farmers, partners and visitors — fair prices, clear records, no shortcuts.',
  },
  {
    title: 'Community',
    text: 'We grow by helping local farmers and communities grow with us, not around them.',
  },
  {
    title: 'Sustainability',
    text: 'Livestock and tourism that respect the land, the animals and the people who depend on both.',
  },
];

// ---------------------------------------------------------------------------
// EDITABLE CONTENT — update the values below with real DALFAM information.
// IMAGES: put actual photo files in frontend/public/images/ using the file
// names referenced below, or edit the paths to match your own file names.
// ---------------------------------------------------------------------------

// The company founder's photo. File: frontend/public/images/founder.jpg
const FOUNDER_IMAGE = '/images/founder.jpg';

const FOUNDER = {
  name: 'Founder Name',
  role: 'Founder & Chief Executive Officer',
  bio: "DALFAM was founded to bring reliable, quality breeding stock to Tanzanian farmers while sharing the country's nature and culture with the world through thoughtful travel. Under this leadership, DALFAM has grown from a small breeding operation into a trusted name across livestock and tourism.",
};

// Current leadership team.
const LEADERSHIP_TEAM = [
  {
    name: 'Leader Name',
    role: 'Head of Pig Breeding',
    image: '/images/leader-breeding.jpg',
    bio: 'Oversees genetic improvement, herd health and production support across all DALFAM breeding farms.',
  },
  {
    name: 'Leader Name',
    role: 'Head of Tourism',
    image: '/images/leader-tourism.jpg',
    bio: 'Designs and manages DALFAM\u2019s travel experiences, guide partnerships and guest relations.',
  },
  {
    name: 'Leader Name',
    role: 'Operations Manager',
    image: '/images/leader-operations.jpg',
    bio: 'Coordinates day-to-day operations, logistics and quality standards across both divisions.',
  },
  {
    name: 'Leader Name',
    role: 'Finance & Administration',
    image: '/images/leader-finance.jpg',
    bio: 'Manages company finances, partnerships and administrative operations.',
  },
];

// Company milestones. Add/edit years and events freely.
const MILESTONES = [
  { year: '2014', title: 'DALFAM Founded', text: 'Started as a small pig-breeding operation serving farmers in the local region.' },
  { year: '2017', title: 'Herd Expansion', text: 'Expanded breeding stock and introduced structured genetic-improvement practices.' },
  { year: '2019', title: 'Tourism Division Launched', text: 'DALFAM Tourism opened, offering guided safaris and cultural tours.' },
  { year: '2022', title: 'Regional Growth', text: 'Grew partnerships with farmers and travel partners across multiple regions.' },
  { year: '2026', title: 'Digital Platform Launched', text: 'Introduced an online system for bookings, breeding records and farmer support.' },
];

// Departments / team overview stats.
const DEPARTMENTS = [
  { value: '4', label: 'Departments' },
  { value: '30+', label: 'Team Members' },
  { value: '2', label: 'Business Divisions' },
  { value: '10+', label: 'Years Operating' },
];

// Certifications, licenses and organisational memberships.
const CERTIFICATIONS = [
  'Registered Company — Tanzania Business Registration and Licensing Agency (BRELA)',
  'Livestock Breeding License — Ministry of Livestock and Fisheries',
  'Tourism Operator License — Tanzania Tourist Board',
  'Member — Tanzania Pig Farmers Association',
];

// Partner organisations. Replace image with a real logo path when available.
const PARTNERS = [
  { name: 'Partner Organisation 1', image: '/images/partner-1.png' },
  { name: 'Partner Organisation 2', image: '/images/partner-2.png' },
  { name: 'Partner Organisation 3', image: '/images/partner-3.png' },
  { name: 'Partner Organisation 4', image: '/images/partner-4.png' },
];

// Gallery photos of farms, animals and tourism experiences.
const GALLERY = [
  { src: '/images/hero-pig-breeding.jpg', alt: 'DALFAM breeding farm' },
  { src: '/images/gallery-2.jpg', alt: 'Pig herd on the farm' },
  { src: '/images/gallery-3.jpg', alt: 'Farmer training session' },
  { src: '/images/gallery-4.jpg', alt: 'Guided safari tour' },
  { src: '/images/gallery-5.jpg', alt: 'Cultural tourism visit' },
  { src: '/images/gallery-6.jpg', alt: 'DALFAM team at work' },
];

// Testimonials from farmers and travellers.
const TESTIMONIALS = [
  {
    quote: 'DALFAM gave me healthy breeding stock and kept supporting me even after the sale. My herd has never been stronger.',
    name: 'Farmer Name',
    role: 'Pig Farmer, Morogoro',
  },
  {
    quote: 'Our safari with DALFAM was personal and well organised from start to finish. It felt like travelling with friends who know the land.',
    name: 'Traveller Name',
    role: 'Visitor from Kenya',
  },
  {
    quote: 'The training I received on biosecurity changed how I run my farm. Fewer losses, healthier pigs, better income.',
    name: 'Farmer Name',
    role: 'Pig Farmer, Iringa',
  },
];

// Primary contact email shown in the footer.
const COMPANY_EMAIL = 'info@dalfam.co.tz';

// Company locations / branches.
const LOCATIONS = [
  { name: 'Head Office', address: 'Dar es Salaam, Tanzania', phone: '+255 XXX XXX XXX' },
  { name: 'Breeding Farm', address: 'Morogoro Region, Tanzania', phone: '+255 XXX XXX XXX' },
  { name: 'Tourism Office', address: 'Arusha, Tanzania', phone: '+255 XXX XXX XXX' },
];

// Awards and recognition.
const AWARDS = [
  { year: '2023', title: 'Regional Livestock Excellence Award', issuer: 'Ministry of Livestock and Fisheries' },
  { year: '2024', title: 'Responsible Tourism Recognition', issuer: 'Tanzania Tourist Board' },
];

// Frequently asked questions about the company.
const FAQS = [
  {
    q: 'Where is DALFAM based?',
    a: 'DALFAM is headquartered in Dar es Salaam, with a breeding farm in Morogoro and a tourism office in Arusha, Tanzania.',
  },
  {
    q: 'Do you sell breeding stock outside Tanzania?',
    a: 'Our primary focus is supporting Tanzanian farmers, but we are open to regional enquiries — please contact us to discuss.',
  },
  {
    q: 'Can I visit a DALFAM farm as a tourist?',
    a: 'Yes. Our Farm Stay experiences let travellers visit our breeding farms as part of a tourism package.',
  },
  {
    q: 'How do I become a partner or supplier?',
    a: 'Reach out through our Contact page with details about your organisation and how you would like to work with us.',
  },
];

// Social media links. Replace with real URLs, or remove a line to hide it.
const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/' },
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'YouTube', href: 'https://youtube.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
];

// Simple placeholder shown when a photo file hasn't been added yet, so the
// layout never breaks even before real photos are uploaded.
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

function PersonPhoto({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-dalfam-green/10 text-dalfam-green ${className}`}
        aria-label={alt}
      >
        <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" strokeLinecap="round" />
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

export default function About() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-dalfam-cream">
      <Navbar active="About Us" />

      {/* Page hero */}
      <section
        className="text-white"
        style={{
          background:
            'linear-gradient(180deg, rgba(18,36,31,0.94) 0%, rgba(47,74,60,0.9) 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl">About Us</h1>
          <p className="mt-5 text-lg text-gray-200 max-w-2xl mx-auto">
            DALFAM Company Ltd is a Tanzanian enterprise built on two things
            we believe belong together: disciplined livestock production and
            memorable travel experiences.
          </p>
        </div>
      </section>

      {/* Our story */}
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-4">
              Our Story
            </h2>
            <p className="text-black leading-relaxed mb-4">
              DALFAM began with a simple observation: Tanzanian farmers
              needed reliable access to quality breeding stock, and
              Tanzania's landscapes and culture deserved to be shared with
              the world in a more thoughtful way. We built a company around
              both.
            </p>
            <p className="text-black leading-relaxed mb-4">
              On the livestock side, we focus on commercial pig breeding —
              genetic improvement, herd health and biosecurity, and
              production support that helps farmers build sustainable,
              market-ready herds.
            </p>
            <p className="text-black leading-relaxed">
              On the tourism side, we design and host travel experiences
              that connect visitors with Tanzania's nature, culture and
              communities, in partnership with the people who know it best.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
            <h3 className="font-serif text-lg font-bold text-dalfam-dark mb-3">
              Our Mission
            </h3>
            <p className="text-black text-sm leading-relaxed mb-5">
              To build productive, sustainable livestock systems and deliver
              travel experiences that leave a lasting, positive impact —
              for our clients, our partners and our communities.
            </p>
            <h3 className="font-serif text-lg font-bold text-dalfam-dark mb-3">
              Our Vision
            </h3>
            <p className="text-black text-sm leading-relaxed">
              To be East Africa's most trusted name in livestock breeding
              and community-centred tourism.
            </p>
          </div>
        </div>
      </section>

      {/* Milestones / timeline */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-12 text-center">
            Our Journey
          </h2>
          <div className="relative pl-8 sm:pl-0">
            <div className="absolute left-3 sm:left-1/2 top-0 bottom-0 w-px bg-dalfam-gold/40 sm:-translate-x-1/2" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative sm:flex sm:items-center sm:gap-10 ${
                    i % 2 === 1 ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  <div className="absolute left-3 sm:left-1/2 w-3 h-3 rounded-full bg-dalfam-gold -translate-x-1/2 mt-1.5" />
                  <div className="sm:w-1/2" />
                  <div
                    className={`sm:w-1/2 ${
                      i % 2 === 1 ? 'sm:text-right sm:pr-4' : 'sm:pl-4'
                    }`}
                  >
                    <span className="text-dalfam-gold font-serif font-bold text-lg">
                      {m.year}
                    </span>
                    <h3 className="font-serif font-bold text-dalfam-dark mt-1">
                      {m.title}
                    </h3>
                    <p className="text-black text-sm leading-relaxed mt-1">
                      {m.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-10 text-center">
          Meet Our Founder
        </h2>
        <div className="grid md:grid-cols-3 gap-10 items-center">
          <div className="md:col-span-1 flex justify-center">
            <PersonPhoto
              src={FOUNDER_IMAGE}
              alt={FOUNDER.name}
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-dalfam-gold/30"
            />
          </div>
          <div className="md:col-span-2 text-center md:text-left">
            <h3 className="font-serif text-xl font-bold text-dalfam-dark">
              {FOUNDER.name}
            </h3>
            <p className="text-sm tracking-widest text-dalfam-gold font-semibold mb-4">
              {FOUNDER.role.toUpperCase()}
            </p>
            <p className="text-black leading-relaxed">{FOUNDER.bio}</p>
          </div>
        </div>
      </section>

      {/* Current leadership */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-3 text-center">
            Our Leadership Team
          </h2>
          <p className="text-black text-center max-w-2xl mx-auto mb-12">
            The people leading DALFAM's breeding and tourism operations today.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {LEADERSHIP_TEAM.map((person) => (
              <div
                key={person.name + person.role}
                className="rounded-lg border border-gray-200 overflow-hidden text-center"
              >
                <PersonPhoto
                  src={person.image}
                  alt={person.name}
                  className="w-full h-48"
                />
                <div className="p-5">
                  <h3 className="font-serif text-base font-bold text-dalfam-dark">
                    {person.name}
                  </h3>
                  <p className="text-xs tracking-widest text-dalfam-gold font-semibold mt-1 mb-3">
                    {person.role.toUpperCase()}
                  </p>
                  <p className="text-black text-sm leading-relaxed">
                    {person.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments / team stats */}
      <section className="bg-dalfam-green text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {DEPARTMENTS.map((d) => (
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

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-10 text-center">
          What Guides Us
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h3 className="font-serif text-lg font-bold text-dalfam-green mb-2">
                {v.title}
              </h3>
              <p className="text-black text-sm leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications & partnerships */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-6">
                Certifications & Licenses
              </h2>
              <ul className="space-y-3">
                {CERTIFICATIONS.map((c) => (
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

            <div>
              <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-6">
                Our Partners
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {PARTNERS.map((p) => (
                  <div
                    key={p.name}
                    className="rounded-lg border border-gray-200 p-4 flex items-center justify-center h-20"
                  >
                    <ImageWithFallback
                      src={p.image}
                      alt={p.name}
                      className="max-h-full max-w-full"
                      iconSize="30%"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-3 text-center">
          Our Farms & Experiences
        </h2>
        <p className="text-black text-center max-w-2xl mx-auto mb-12">
          A look at DALFAM's breeding operations and the tourism experiences
          we host across Tanzania.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {GALLERY.map((g) => (
            <ImageWithFallback
              key={g.src}
              src={g.src}
              alt={g.alt}
              className="w-full h-40 sm:h-52 rounded-lg"
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-dalfam-dark text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl font-bold mb-12 text-center">
            What People Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
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

      {/* Locations */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-10 text-center">
          Where To Find Us
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {LOCATIONS.map((loc) => (
            <div key={loc.name} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-serif text-lg font-bold text-dalfam-dark mb-2">
                {loc.name}
              </h3>
              <p className="text-black text-sm mb-1">{loc.address}</p>
              <p className="text-black text-sm">{loc.phone}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
          <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-10 text-center">
            Awards & Recognition
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {AWARDS.map((a) => (
              <div key={a.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-dalfam-gold/10 text-dalfam-gold flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="9" r="5" />
                    <path d="M9 13.5L7 21l5-3 5 3-2-7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs tracking-widest text-dalfam-gold font-semibold">
                    {a.year}
                  </span>
                  <h3 className="font-serif font-bold text-dalfam-dark mt-1">
                    {a.title}
                  </h3>
                  <p className="text-black text-sm">{a.issuer}</p>
                </div>
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
          {FAQS.map((f, i) => (
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
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-3">
          Want to work with DALFAM?
        </h2>
        <p className="text-black mb-8 max-w-xl mx-auto">
          Whether you're a farmer looking for quality breeding stock or a
          traveller planning your next trip to Tanzania, we'd love to hear
          from you.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 rounded-md bg-dalfam-gold text-dalfam-dark font-semibold hover:bg-yellow-500 transition-colors"
        >
          Contact Us
        </a>
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
                  <a href={link.href} className="text-gray-400 hover:text-dalfam-gold transition-colors">
                    {link.label}
                  </a>
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
                <a href="/pig-breeding" className="text-gray-400 hover:text-dalfam-gold transition-colors">
                  Pig Breeding
                </a>
              </li>
              <li>
                <a href="/tourism" className="text-gray-400 hover:text-dalfam-gold transition-colors">
                  Tourism
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-400 hover:text-dalfam-gold transition-colors">
                  Blog
                </a>
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
                {LOCATIONS[0].address}
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dalfam-gold flex-shrink-0 mt-0.5">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {LOCATIONS[0].phone}
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
