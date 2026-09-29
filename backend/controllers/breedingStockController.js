const fs = require('fs');
const path = require('path');
const { BreedingStock, Litter, HealthRecord } = require('../models');
const { Op } = require('sequelize');

const removeFileIfExists = (imageUrl) => {
  if (!imageUrl) return;
  const filePath = path.join(__dirname, '..', imageUrl.replace(/^\//, ''));
  fs.unlink(filePath, () => {}); // ignore errors (file may already be gone)
};

// ---- PUBLIC (no login required) ----------------------------------------
// Used by the public Pig Breeding page gallery. Only returns animals the
// admin has explicitly marked as public (isPublic: true) and that aren't
// sold/deceased, so internal records stay private by default.
exports.getPublic = async (req, res) => {
  const animals = await BreedingStock.findAll({
    where: {
      isPublic: true,
      status: { [Op.in]: ['active', 'quarantine'] },
    },
    attributes: ['id', 'tagNumber', 'name', 'breed', 'sex', 'status', 'weightKg', 'imageUrl'],
    order: [['createdAt', 'DESC']],
  });
  res.json(animals);
};

// ---- PROTECTED (dashboard / admin area) ---------------------------------

exports.getAll = async (req, res) => {
  const { status, sex, search } = req.query;
  const where = {};
  if (status) where.status = status;
  if (sex) where.sex = sex;
  if (search) {
    where[Op.or] = [
      { tagNumber: { [Op.like]: `%${search}%` } },
      { name: { [Op.like]: `%${search}%` } },
      { breed: { [Op.like]: `%${search}%` } },
    ];
  }
  const animals = await BreedingStock.findAll({ where, order: [['createdAt', 'DESC']] });
  res.json(animals);
};

exports.getOne = async (req, res) => {
  const animal = await BreedingStock.findByPk(req.params.id, {
    include: [
      { model: Litter, as: 'litters' },
      { model: HealthRecord, as: 'healthRecords' },
    ],
  });
  if (!animal) return res.status(404).json({ message: 'Animal not found' });
  res.json(animal);
};

exports.create = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/breeding-stock/${req.file.filename}` : null;
    const isPublic = req.body.isPublic === 'true' || req.body.isPublic === true;

    const animal = await BreedingStock.create({
      ...req.body,
      imageUrl,
      isPublic,
    });
    res.status(201).json(animal);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create record', error: err.message });
  }
};

exports.update = async (req, res) => {
  const animal = await BreedingStock.findByPk(req.params.id);
  if (!animal) return res.status(404).json({ message: 'Animal not found' });
  try {
    const updates = { ...req.body };

    if (updates.isPublic !== undefined) {
      updates.isPublic = updates.isPublic === 'true' || updates.isPublic === true;
    }

    // If a new photo was uploaded, replace the old one
    if (req.file) {
      removeFileIfExists(animal.imageUrl);
      updates.imageUrl = `/uploads/breeding-stock/${req.file.filename}`;
    }

    await animal.update(updates);
    res.json(animal);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update record', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const animal = await BreedingStock.findByPk(req.params.id);
  if (!animal) return res.status(404).json({ message: 'Animal not found' });
  removeFileIfExists(animal.imageUrl);
  await animal.destroy();
  res.json({ message: 'Animal record deleted' });
};

exports.stats = async (req, res) => {
  const total = await BreedingStock.count();
  const active = await BreedingStock.count({ where: { status: 'active' } });
  const females = await BreedingStock.count({ where: { sex: 'female' } });
  const males = await BreedingStock.count({ where: { sex: 'male' } });
  res.json({ total, active, females, males });
};
