import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router changes the page without reloading the browser, so the browser
// keeps the old scroll position. This resets it to the top on every route
// change. Must be rendered inside the Router (e.g. at the top of <App />).
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
