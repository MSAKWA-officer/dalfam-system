const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc  Register a new user
// @route POST /api/auth/register
// Rule: if no users exist yet, this open call creates the first ADMIN (system bootstrap).
// After that, only an authenticated admin can create new users (see routes).
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const userCount = await User.count();
    const isFirstUser = userCount === 0;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: isFirstUser ? 'admin' : (role === 'admin' ? 'admin' : 'staff'),
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// @desc  Login
// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// @desc  Get current logged-in user profile
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// @desc  List all users (admin only)
// @route GET /api/auth/users
exports.listUsers = async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
};

// @desc  Deactivate / reactivate a user (admin only)
// @route PATCH /api/auth/users/:id/status
exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isActive = isActive;
  await user.save();
  res.json({ message: 'User status updated', user });
};

// @desc  Edit a user's name, email and/or role (admin only)
// @route PUT /api/auth/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role && ['admin', 'staff'].includes(role)) user.role = role;

    await user.save();

    const { password, ...safeUser } = user.toJSON();
    res.json(safeUser);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update user', error: err.message });
  }
};

// @desc  Reset a user's password (admin only)
// @route PUT /api/auth/users/:id/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to reset password', error: err.message });
  }
};
