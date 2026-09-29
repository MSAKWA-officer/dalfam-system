const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HealthRecord = sequelize.define('HealthRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  breedingStockId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'breeding_stock', key: 'id' },
  },
  litterId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'litters', key: 'id' },
  },
  recordType: {
    type: DataTypes.ENUM('vaccination', 'treatment', 'checkup', 'mortality'),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateAdministered: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  administeredBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nextDueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'health_records',
});

module.exports = HealthRecord;
