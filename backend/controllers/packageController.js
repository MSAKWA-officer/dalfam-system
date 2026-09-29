const fs = require('fs');
const path = require('path');
const { TourismPackage, Booking } = require('../models');

const removeFileIfExists = (imageUrl) => {
  if (!imageUrl) return;
  const filePath = path.join(__dirname, '..', imageUrl.replace(/^\//, ''));
  fs.unlink(filePath, () => {}); // ignore errors (file may already be gone)
};

// ---- PUBLIC (no login required) ----------------------------------------
// Used by the public Tourism page gallery. Only returns packages the admin
// has explicitly marked as public (isPublic: true) and that are active, so
// inactive/internal packages stay private by default.
exports.getPublic = async (req, res) => {
  const packages = await TourismPackage.findAll({
    where: { isPublic: true, status: 'active' },
    attributes: ['id', 'name', 'description', 'category', 'durationDays', 'price', 'maxGuests', 'imageUrl'],
    order: [['createdAt', 'DESC']],
  });
  res.json(packages);
};

// ---- PROTECTED (dashboard / admin area) ---------------------------------

exports.getAll = async (req, res) => {
  const { status, category } = req.query;
  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;
  const packages = await TourismPackage.findAll({ where, order: [['createdAt', 'DESC']] });
  res.json(packages);
};

exports.getOne = async (req, res) => {
  const pkg = await TourismPackage.findByPk(req.params.id, {
    include: [{ model: Booking, as: 'bookings' }],
  });
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  res.json(pkg);
};

exports.create = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/tourism-packages/${req.file.filename}` : null;
    const isPublic = req.body.isPublic === 'true' || req.body.isPublic === true;

    const pkg = await TourismPackage.create({
      ...req.body,
      imageUrl,
      isPublic,
    });
    res.status(201).json(pkg);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create package', error: err.message });
  }
};

exports.update = async (req, res) => {
  const pkg = await TourismPackage.findByPk(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  try {
    const updates = { ...req.body };

    if (updates.isPublic !== undefined) {
      updates.isPublic = updates.isPublic === 'true' || updates.isPublic === true;
    }

    // If a new photo was uploaded, replace the old one
    if (req.file) {
      removeFileIfExists(pkg.imageUrl);
      updates.imageUrl = `/uploads/tourism-packages/${req.file.filename}`;
    }

    await pkg.update(updates);
    res.json(pkg);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update package', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const pkg = await TourismPackage.findByPk(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  removeFileIfExists(pkg.imageUrl);
  await pkg.destroy();
  res.json({ message: 'Package deleted' });
};
