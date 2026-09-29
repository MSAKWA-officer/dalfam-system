const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TourismPackage = sequelize.define('TourismPackage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('nature', 'cultural', 'corporate', 'custom'),
    defaultValue: 'nature',
  },
  durationDays: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  maxGuests: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
  // NEW: relative path served statically by the backend, e.g.
  // /uploads/tourism-packages/169..-safari.jpg — set when the admin uploads
  // a photo for this package. Used by the public Tourism page gallery.
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // NEW: lets the admin choose which active packages appear in the public
  // "Available Tour Packages" gallery on the website, without affecting
  // internal/inactive packages that shouldn't be shown publicly.
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'tourism_packages',
});

module.exports = TourismPackage;
