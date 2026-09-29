import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { formatDate, getAssetUrl } from '../utils/format';
import Navbar, { NAV_LINKS } from '../components/Navbar';

// ---------------------------------------------------------------------------
// EDITABLE CONTENT — kept the same values used across the site (Contact/About
// pages) so the footer stays in sync. Update here and mirror there too.
// ---------------------------------------------------------------------------
const COMPANY_PHONE_DISPLAY = '+255 750 458 107';
// WhatsApp needs the number without spaces/plus sign, with country code.
const COMPANY_WHATSAPP_NUMBER = '255750458107';
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

// Hero background image for this page.
// Put the actual file at: frontend/public/images/hero-blog.jpg
// (change this path if you name the file differently)
const BLOG_HERO_IMAGE = '/images/hero-blog.jpg';

const CATEGORY_LABELS = {
  General: 'General',
  'Pig Breeding': 'Pig Breeding',
  Tourism: 'Tourism',
};

// Rough reading time from the full post body, so readers know what they're
// getting into before they click through.
function estimateReadingMinutes(text) {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Post photo with a neutral placeholder fallback so the layout never breaks
// before a cover image has been uploaded.
function PostPhoto({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-dalfam-green/10 text-dalfam-green ${className}`}
        aria-label={alt}
      >
        <svg width="30%" height="30%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Public endpoint — no login required, returns only "published" posts
        const { data } = await api.get('/blog/public');
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const whatsappHref = `https://wa.me/${COMPANY_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_DEFAULT_MESSAGE
  )}`;

  return (
    <div className="min-h-screen bg-dalfam-cream">
      <Navbar active="Blog" />

      {/* Page hero */}
      <section className="relative text-white overflow-hidden min-h-[320px] md:min-h-[380px] flex items-center bg-dalfam-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${BLOG_HERO_IMAGE}')` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(18,36,31,0.8) 0%, rgba(18,36,31,0.65) 45%, rgba(18,36,31,0.94) 100%)',
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center w-full">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl">Blog</h1>
          <p className="mt-5 text-lg text-gray-200 max-w-2xl mx-auto">
            Notes, guides and stories from DALFAM's pig breeding and tourism
            teams.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        {loading && (
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-gray-200 overflow-hidden bg-white flex flex-col sm:flex-row animate-pulse">
                <div className="w-full sm:w-2/5 h-56 sm:h-auto bg-gray-200" />
                <div className="p-6 space-y-3 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-black">
            Imeshindikana kupakia machapisho kwa sasa. Jaribu tena baadaye,
            au{' '}
            <Link to="/contact" className="text-dalfam-green font-medium hover:text-dalfam-gold">
              wasiliana nasi
            </Link>.
          </p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-black">
            Hakuna machapisho bado. Rejea hapa hivi karibuni.
          </p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col sm:flex-row"
              >
                <PostPhoto
                  src={post.imageUrl ? getAssetUrl(post.imageUrl) : null}
                  alt={post.title}
                  className="w-full sm:w-2/5 h-56 sm:h-auto flex-shrink-0"
                />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-3">
                    <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full bg-dalfam-green/10 text-dalfam-green">
                      {CATEGORY_LABELS[post.category] || post.category || 'General'}
                    </span>
                    <span className="text-xs text-black">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span className="text-xs text-black">
                      &middot; {estimateReadingMinutes(post.content || post.excerpt)} min soma
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-dalfam-dark mb-3 leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-black text-sm leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <span className="text-sm text-black">
                      {post.author?.name ? `Na ${post.author.name}` : 'DALFAM Team'}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 text-center">
          <h2 className="font-serif text-2xl font-bold text-dalfam-dark mb-3">
            Have a question for our team?
          </h2>
          <p className="text-black mb-8 max-w-xl mx-auto">
            Reach out and we'll point you to the right resource — or write it
            up in a future post.
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
