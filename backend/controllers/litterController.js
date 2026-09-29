const { Litter, BreedingStock } = require('../models');

exports.getAll = async (req, res) => {
  const litters = await Litter.findAll({
    include: [{ model: BreedingStock, as: 'sow', attributes: ['id', 'tagNumber', 'name', 'breed'] }],
    order: [['farrowingDate', 'DESC']],
  });
  res.json(litters);
};

exports.getOne = async (req, res) => {
  const litter = await Litter.findByPk(req.params.id, {
    include: [{ model: BreedingStock, as: 'sow' }],
  });
  if (!litter) return res.status(404).json({ message: 'Litter not found' });
  res.json(litter);
};

exports.create = async (req, res) => {
  try {
    const litter = await Litter.create(req.body);
    res.status(201).json(litter);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create litter record', error: err.message });
  }
};

exports.update = async (req, res) => {
  const litter = await Litter.findByPk(req.params.id);
  if (!litter) return res.status(404).json({ message: 'Litter not found' });
  try {
    await litter.update(req.body);
    res.json(litter);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update litter record', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const litter = await Litter.findByPk(req.params.id);
  if (!litter) return res.status(404).json({ message: 'Litter not found' });
  await litter.destroy();
  res.json({ message: 'Litter record deleted' });
};
