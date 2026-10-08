// Tiny in-memory rate limiter (no extra npm package needed).
// Limits how many requests one IP can make in a time window — protects the
// public booking form from spam. Resets when the server restarts, which is
// fine for a single-server setup. For multiple servers use `express-rate-limit`.
//
// If the API sits behind Nginx/a proxy, add this line in server.js (after
// `const app = express();`) so the real visitor IP is used:
//   app.set('trust proxy', 1);
module.exports = function rateLimit({ windowMs = 60 * 60 * 1000, max = 10 } = {}) {
  const hits = new Map(); // ip -> { count, resetAt }

  // Clean up expired entries now and then so memory never grows.
  setInterval(() => {
    const now = Date.now();
    hits.forEach((v, k) => { if (v.resetAt <= now) hits.delete(k); });
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      const minutes = Math.ceil((entry.resetAt - now) / 60000);
      return res.status(429).json({
        message: `Too many attempts. Please try again in ${minutes} minute(s) or contact us directly.`,
      });
    }
    return next();
  };
};
