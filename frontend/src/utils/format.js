// Shared formatting helpers used across features.

export const formatCurrency = (amount, currency = 'TZS') => {
  if (amount === null || amount === undefined || amount === '') return '—';
  return `${currency} ${Number(amount).toLocaleString()}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// NEW: turns a relative path like "/uploads/blog/xxx.jpg" (returned by the API)
// into a full URL pointing at the backend server, e.g.
// "http://localhost:5000/uploads/blog/xxx.jpg". Falls back to a placeholder
// when the post has no image yet.
export const getAssetUrl = (relativePath) => {
  if (!relativePath) return null;
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const origin = apiUrl.replace(/\/api\/?$/, '');
  return `${origin}${relativePath}`;
};
