const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BreedingStock = sequelize.define('BreedingStock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tagNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sex: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  sourceType: {
    type: DataTypes.ENUM('born_on_farm', 'purchased'),
    defaultValue: 'born_on_farm',
  },
  status: {
    type: DataTypes.ENUM('active', 'quarantine', 'sold', 'deceased'),
    defaultValue: 'active',
  },
  weightKg: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // NEW: relative path served statically by the backend, e.g.
  // /uploads/breeding-stock/169..-tag12.jpg — set when the admin uploads a
  // photo for this animal. Used by the public Pig Breeding page gallery.
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // NEW: lets the admin choose which active animals appear in the public
  // "Our Breeding Stock" gallery on the website, without affecting internal
  // records that shouldn't be shown publicly.
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'breeding_stock',
});

module.exports = BreedingStock;
