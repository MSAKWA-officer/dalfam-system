const { Booking, TourismPackage } = require('../models');

exports.getAll = async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status) where.status = status;
  const bookings = await Booking.findAll({
    where,
    include: [{ model: TourismPackage, as: 'package', attributes: ['id', 'name', 'price', 'category'] }],
    order: [['startDate', 'DESC']],
  });
  res.json(bookings);
};

exports.getOne = async (req, res) => {
  const booking = await Booking.findByPk(req.params.id, {
    include: [{ model: TourismPackage, as: 'package' }],
  });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

exports.create = async (req, res) => {
  try {
    // Auto-calculate totalAmount if not provided
    if (!req.body.totalAmount && req.body.packageId && req.body.numberOfGuests) {
      const pkg = await TourismPackage.findByPk(req.body.packageId);
      if (pkg) {
        req.body.totalAmount = Number(pkg.price) * Number(req.body.numberOfGuests);
      }
    }
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create booking', error: err.message });
  }
};

exports.update = async (req, res) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  try {
    await booking.update(req.body);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update booking', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  await booking.destroy();
  res.json({ message: 'Booking deleted' });
};

exports.stats = async (req, res) => {
  const total = await Booking.count();
  const pending = await Booking.count({ where: { status: 'pending' } });
  const confirmed = await Booking.count({ where: { status: 'confirmed' } });
  const completed = await Booking.count({ where: { status: 'completed' } });
  res.json({ total, pending, confirmed, completed });
};
