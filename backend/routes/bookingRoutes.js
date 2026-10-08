const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const rateLimit = require('../middleware/rateLimit');

// ---- PUBLIC (no login required) — used by the website's /book page ----
// Must stay ABOVE router.use(protect) and the '/:id' route.
router.post('/public', rateLimit({ windowMs: 60 * 60 * 1000, max: 8 }), ctrl.createPublic);
router.get('/public/track', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }), ctrl.trackPublic);

// ---- PROTECTED (dashboard / admin area) ----
router.use(protect);

router.get('/', ctrl.getAll);
router.get('/stats', ctrl.stats);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
