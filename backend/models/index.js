const sequelize = require('../config/database');
const User = require('./User');
const BreedingStock = require('./BreedingStock');
const Litter = require('./Litter');
const HealthRecord = require('./HealthRecord');
const TourismPackage = require('./TourismPackage');
const Booking = require('./Booking');
const ContactMessage = require('./ContactMessage');
const BlogPost = require('./BlogPost'); // NEW

// Associations: Pig Breeding
BreedingStock.hasMany(Litter, { foreignKey: 'sowId', as: 'litters', onDelete: 'CASCADE' });
Litter.belongsTo(BreedingStock, { foreignKey: 'sowId', as: 'sow' });

BreedingStock.hasMany(HealthRecord, { foreignKey: 'breedingStockId', as: 'healthRecords', onDelete: 'CASCADE' });
HealthRecord.belongsTo(BreedingStock, { foreignKey: 'breedingStockId', as: 'animal' });

Litter.hasMany(HealthRecord, { foreignKey: 'litterId', as: 'healthRecords', onDelete: 'CASCADE' });
HealthRecord.belongsTo(Litter, { foreignKey: 'litterId', as: 'litter' });

// Associations: Tourism
TourismPackage.hasMany(Booking, { foreignKey: 'packageId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(TourismPackage, { foreignKey: 'packageId', as: 'package' });

// Associations: Blog (NEW)
User.hasMany(BlogPost, { foreignKey: 'authorId', as: 'blogPosts', onDelete: 'SET NULL' });
BlogPost.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = {
  sequelize,
  User,
  BreedingStock,
  Litter,
  HealthRecord,
  TourismPackage,
  Booking,
  ContactMessage,
  BlogPost, // NEW
};
