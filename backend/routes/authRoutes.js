const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { User } = require('../models');

// Public login always allowed
router.post('/login', authController.login);

// Registration: open ONLY if there are zero users in the system (first admin bootstrap).
// Otherwise it requires an authenticated admin.
router.post('/register', async (req, res, next) => {
  const userCount = await User.count();
  if (userCount === 0) {
    return authController.register(req, res);
  }
  return protect(req, res, () => authorize('admin')(req, res, () => authController.register(req, res)));
});

router.get('/me', protect, authController.getMe);
router.get('/users', protect, authorize('admin'), authController.listUsers);
router.patch('/users/:id/status', protect, authorize('admin'), authController.updateUserStatus);
router.put('/users/:id', protect, authorize('admin'), authController.updateUser);
router.put('/users/:id/reset-password', protect, authorize('admin'), authController.resetPassword);

module.exports = router;
