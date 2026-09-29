const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/packageController');
const upload = require('../middleware/tourismPackageUploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

// ---- PUBLIC (no login required) — used by the public Tourism page ----
router.get('/public', ctrl.getPublic);

// ---- PROTECTED (dashboard / admin area) ----
router.use(protect);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', upload.single('image'), ctrl.create);
router.put('/:id', upload.single('image'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
