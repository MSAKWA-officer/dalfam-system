const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/breedingStockController');
const upload = require('../middleware/breedingStockUploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

// ---- PUBLIC (no login required) — used by the public Pig Breeding page ----
router.get('/public', ctrl.getPublic);

// ---- PROTECTED (dashboard / admin area) ----
router.use(protect);

router.get('/', ctrl.getAll);
router.get('/stats', ctrl.stats);
router.get('/:id', ctrl.getOne);
router.post('/', upload.single('image'), ctrl.create);
router.put('/:id', upload.single('image'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove); // only admin can delete

module.exports = router;
