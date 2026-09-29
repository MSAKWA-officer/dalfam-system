const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/healthRecordController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
