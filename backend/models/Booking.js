const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tourism_packages', key: 'id' },
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numberOfGuests: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // NEW: short code shown to online customers (e.g. DAL-261007-K7M2) so they
  // can quote it and track their booking. Null for older/admin-created rows.
  reference: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  // NEW: where the booking came from — 'online' = public website form,
  // 'admin' = created by staff inside the system.
  source: {
    type: DataTypes.ENUM('admin', 'online'),
    defaultValue: 'admin',
  },
}, {
  tableName: 'bookings',
  indexes: [{ name: 'bookings_reference_unique', unique: true, fields: ['reference'] }],
});

module.exports = Booking;
