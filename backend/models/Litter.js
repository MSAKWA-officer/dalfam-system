const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Litter = sequelize.define('Litter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sowId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'breeding_stock', key: 'id' },
  },
  sireTag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  farrowingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  totalBorn: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  bornAlive: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stillborn: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  weaned: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  weaningDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'litters',
});

module.exports = Litter;
