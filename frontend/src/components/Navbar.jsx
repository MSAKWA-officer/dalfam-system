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
      <header className="fixed inset-x-0 top-0 z-50 bg-dalfam-dark text-white shadow-md">
        <div className={`max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between ${NAVBAR_HEIGHT}`}>
          {/* Logo (clickable, goes Home) + wordmark (plain text, not clickable) */}
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="DALFAM home" className="flex-shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="19" fill="#12241F" stroke="#D4A017" strokeWidth="2" />
                <path
                  d="M13 27V13h6.5c3.6 0 6 2.6 6 6.9 0 4.4-2.4 7.1-6.2 7.1H13zm3.4-3h2.7c1.9 0 3.3-1.5 3.3-4.1 0-2.5-1.3-4-3.3-4h-2.7v8.1z"
                  fill="#D4A017"
                />
              </svg>
            </Link>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold tracking-wide text-dalfam-gold">
                DALFAM
              </span>
              <span className="text-xs tracking-widest text-gray-300 hidden sm:inline">
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
                    ? 'text-dalfam-gold font-medium'
                    : 'text-gray-200 hover:text-dalfam-gold transition-colors'
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
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
          <div className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4 bg-dalfam-dark max-h-[calc(100vh-5rem)] overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={link.label === active ? 'text-dalfam-gold font-medium' : 'text-gray-200'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Spacer so fixed header doesn't cover the page content underneath it */}
      <div className={NAVBAR_HEIGHT} aria-hidden="true" />
    </>
  );
}
