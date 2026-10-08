const { Booking, TourismPackage } = require('../models');

// ---- helpers for the PUBLIC online booking ------------------------------
const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I confusion

const makeReference = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  let rand = '';
  for (let i = 0; i < 4; i += 1) rand += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  return `DAL-${ymd}-${rand}`;
};

const uniqueReference = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const ref = makeReference();
    // eslint-disable-next-line no-await-in-loop
    const taken = await Booking.findOne({ where: { reference: ref } });
    if (!taken) return ref;
  }
};

const toDateOnly = (d) => d.toISOString().slice(0, 10);
const isValidDate = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str) && !Number.isNaN(new Date(str).getTime());
const digitsOnly = (v) => String(v || '').replace(/\D/g, '');
const lastDigits = (v) => digitsOnly(v).slice(-9); // match 0718.. and +255718.. alike
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const publicView = (b, pkgName) => ({
  reference: b.reference,
  packageName: pkgName,
  numberOfGuests: b.numberOfGuests,
  startDate: b.startDate,
  endDate: b.endDate,
  totalAmount: b.totalAmount,
  status: b.status,
  createdAt: b.createdAt,
});

// ---- PUBLIC (no login) — website "Book Online" ---------------------------
// Never trusts the browser for price/status/source: those are set here.
exports.createPublic = async (req, res) => {
  try {
    const {
      packageId, customerName, customerEmail, customerPhone,
      numberOfGuests, startDate, notes, website,
    } = req.body;

    // Honeypot: real visitors never fill this hidden field. Pretend success.
    if (website) return res.status(201).json({ message: 'Booking received' });

    const name = String(customerName || '').trim();
    const phone = String(customerPhone || '').trim();
    const email = String(customerEmail || '').trim();
    const guests = parseInt(numberOfGuests, 10);

    if (!packageId) return res.status(400).json({ message: 'Please choose a tour package' });
    if (name.length < 2) return res.status(400).json({ message: 'Please enter your full name' });
    if (digitsOnly(phone).length < 9) return res.status(400).json({ message: 'Please enter a valid phone number' });
    if (email && !isEmail(email)) return res.status(400).json({ message: 'Please enter a valid email address' });
    if (!Number.isInteger(guests) || guests < 1) return res.status(400).json({ message: 'Number of guests must be at least 1' });
    if (!isValidDate(startDate)) return res.status(400).json({ message: 'Please choose a valid travel date' });

    const today = toDateOnly(new Date());
    if (startDate < today) return res.status(400).json({ message: 'Travel date cannot be in the past' });

    // Only active packages that are published on the website can be booked.
    const pkg = await TourismPackage.findOne({
      where: { id: packageId, isPublic: true, status: 'active' },
    });
    if (!pkg) return res.status(404).json({ message: 'This package is not available for online booking' });

    if (guests > pkg.maxGuests) {
      return res.status(400).json({ message: `This package allows up to ${pkg.maxGuests} guests` });
    }

    // Stop accidental double submits (same phone + package + date, still pending).
    const duplicate = await Booking.findOne({
      where: { packageId: pkg.id, startDate, status: 'pending', source: 'online', customerPhone: phone },
    });
    if (duplicate) {
      return res.status(409).json({
        message: `You already have a pending booking for this tour and date (ref ${duplicate.reference}).`,
      });
    }

    const days = Math.max(1, Number(pkg.durationDays) || 1);
    const end = new Date(startDate);
    end.setDate(end.getDate() + days - 1);

    const booking = await Booking.create({
      packageId: pkg.id,
      customerName: name,
      customerEmail: email || null,
      customerPhone: phone,
      numberOfGuests: guests,
      startDate,
      endDate: toDateOnly(end),
      status: 'pending',
      totalAmount: Number(pkg.price) * guests,
      notes: notes ? String(notes).trim().slice(0, 1000) : null,
      source: 'online',
      reference: await uniqueReference(),
    });

    res.status(201).json({
      message: 'Booking received. Our team will contact you shortly to confirm.',
      booking: publicView(booking, pkg.name),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not complete your booking. Please try again or contact us.' });
  }
};

// PUBLIC — customer checks status with reference + phone number.
exports.trackPublic = async (req, res) => {
  const reference = String(req.query.reference || '').trim().toUpperCase();
  const phone = lastDigits(req.query.phone);
  if (!reference || phone.length < 9) {
    return res.status(400).json({ message: 'Enter your booking reference and phone number' });
  }
  const booking = await Booking.findOne({
    where: { reference },
    include: [{ model: TourismPackage, as: 'package', attributes: ['name'] }],
  });
  // Same message for "no such ref" and "wrong phone" so refs can't be probed.
  if (!booking || lastDigits(booking.customerPhone) !== phone) {
    return res.status(404).json({ message: 'No booking found with those details' });
  }
  res.json(publicView(booking, booking.package?.name));
};

// ---- PROTECTED (dashboard) -----------------------------------------------

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
