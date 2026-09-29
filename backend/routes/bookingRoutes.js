const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', ctrl.getAll);
router.get('/stats', ctrl.stats);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
