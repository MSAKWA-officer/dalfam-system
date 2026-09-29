const { HealthRecord, BreedingStock, Litter } = require('../models');

exports.getAll = async (req, res) => {
  const records = await HealthRecord.findAll({
    include: [
      { model: BreedingStock, as: 'animal', attributes: ['id', 'tagNumber', 'name'] },
      { model: Litter, as: 'litter', attributes: ['id', 'farrowingDate'] },
    ],
    order: [['dateAdministered', 'DESC']],
  });
  res.json(records);
};

exports.create = async (req, res) => {
  try {
    const record = await HealthRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create health record', error: err.message });
  }
};

exports.update = async (req, res) => {
  const record = await HealthRecord.findByPk(req.params.id);
  if (!record) return res.status(404).json({ message: 'Health record not found' });
  try {
    await record.update(req.body);
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update health record', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const record = await HealthRecord.findByPk(req.params.id);
  if (!record) return res.status(404).json({ message: 'Health record not found' });
  await record.destroy();
  res.json({ message: 'Health record deleted' });
};
