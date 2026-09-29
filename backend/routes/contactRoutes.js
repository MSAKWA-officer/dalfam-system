const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public: the website's Contact page submits here — no login required
router.post('/', ctrl.create);

// Everything below is for the mfumo/admin dashboard only
router.get('/', protect, ctrl.getAll);
router.get('/:id', protect, ctrl.getOne);
router.put('/:id', protect, ctrl.update);
router.delete('/:id', protect, authorize('admin'), ctrl.remove);

module.exports = router;
