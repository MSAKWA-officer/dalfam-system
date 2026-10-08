import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Add / edit links here once — every page that uses <Navbar /> updates together.
// Exported so pages can reuse the same list in a footer's "Quick Links" section.
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Pig Breeding', href: '/pig-breeding' },
  { label: 'Tourism', href: '/tourism' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

// Height of the top bar. Kept as one constant so the fixed header and its
// spacer (which stops page content from hiding underneath it) always match.
const NAVBAR_HEIGHT = 'h-20'; // 5rem / 80px

// Pale green theme (soft, low-saturation). Colors are Tailwind arbitrary
// values, so no changes to tailwind.config.js are needed.
const BG = 'bg-[#eef4ec]'; // pale green background
const TEXT = 'text-[#1f3a2e]'; // deep green-gray text (readable on pale green)
const ACTIVE = 'text-[#8a6a14] font-semibold'; // darker gold for contrast on light bg
const HOVER = 'hover:text-[#8a6a14]';

/**
 * Site-wide top navigation bar. Fixed to the top of the viewport so it stays
 * visible while the page scrolls.
 *
 * Usage:
 *   <Navbar active="Home" />
 *
 * `active` must match one of the labels in NAV_LINKS above (e.g. "About Us",
 * "Pig Breeding", "Tourism", "Blog", "Contact") so the current page is
 * highlighted in gold. Leave it out if no link should be highlighted.
 */
export default function Navbar({ active }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 ${BG} ${TEXT} shadow-sm border-b border-[#d5e2d1]`}
      >
        <div className={`max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between ${NAVBAR_HEIGHT}`}>
          {/* Logo (clickable, goes Home) + wordmark (plain text, not clickable) */}
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="DALFAM home" className="flex-shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="19" fill="#ffffff" stroke="#c9a24b" strokeWidth="2" />
                <path
                  d="M13 27V13h6.5c3.6 0 6 2.6 6 6.9 0 4.4-2.4 7.1-6.2 7.1H13zm3.4-3h2.7c1.9 0 3.3-1.5 3.3-4.1 0-2.5-1.3-4-3.3-4h-2.7v8.1z"
                  fill="#694f09"
                />
              </svg>
            </Link>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold tracking-wide text-[#8a6a14]">
                DALFAM
              </span>
              <span className="text-xs tracking-widest text-[#5b6f63] hidden sm:inline">
                COMPANY LTD
              </span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={
                  link.label === active
                    ? ACTIVE
                    : `${TEXT} ${HOVER} transition-colors`
                }
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/book"
              className="px-4 py-2 rounded-md bg-[#c9a24b] text-[#12241f] font-semibold hover:bg-yellow-500 transition-colors"
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className={`md:hidden ${TEXT}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div
            className={`md:hidden border-t border-[#d5e2d1] px-6 py-4 flex flex-col gap-4 ${BG} max-h-[calc(100vh-5rem)] overflow-y-auto`}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={link.label === active ? ACTIVE : TEXT}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-md bg-[#c9a24b] text-[#12241f] font-semibold text-center"
            >
              Book Now
            </Link>
          </div>
        )}
      </header>

      {/* Spacer so fixed header doesn't cover the page content underneath it */}
      <div className={NAVBAR_HEIGHT} aria-hidden="true" />
    </>
  );
}
