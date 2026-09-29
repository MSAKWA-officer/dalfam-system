const { ContactMessage } = require('../models');

// Public: called from the website's Contact page form
exports.create = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    const contactMessage = await ContactMessage.create({ name, email, phone, message });
    res.status(201).json({ message: 'Message sent successfully', contactMessage });
  } catch (err) {
    res.status(400).json({ message: 'Failed to send message', error: err.message });
  }
};

// Protected (mfumo/admin dashboard): list all enquiries
exports.getAll = async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status) where.status = status;
  const messages = await ContactMessage.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });
  res.json(messages);
};

// Protected: view one enquiry
exports.getOne = async (req, res) => {
  const contactMessage = await ContactMessage.findByPk(req.params.id);
  if (!contactMessage) return res.status(404).json({ message: 'Message not found' });
  res.json(contactMessage);
};

// Protected: mark as read / replied
exports.update = async (req, res) => {
  const contactMessage = await ContactMessage.findByPk(req.params.id);
  if (!contactMessage) return res.status(404).json({ message: 'Message not found' });
  try {
    await contactMessage.update(req.body);
    res.json(contactMessage);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update message', error: err.message });
  }
};

// Protected: delete an enquiry
exports.remove = async (req, res) => {
  const contactMessage = await ContactMessage.findByPk(req.params.id);
  if (!contactMessage) return res.status(404).json({ message: 'Message not found' });
  await contactMessage.destroy();
  res.json({ message: 'Message deleted' });
};
