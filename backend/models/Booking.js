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
}, {
  tableName: 'bookings',
});

module.exports = Booking;
