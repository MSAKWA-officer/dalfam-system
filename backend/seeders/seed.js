require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, BreedingStock, TourismPackage } = require('../models');

const seed = async () => {
  try {
    await sequelize.sync({ alter: true });

    // Create default admin if none exists
    const adminExists = await User.findOne({ where: { email: 'admin@dalfam.co.tz' } });
    if (!adminExists) {
      const hashed = await bcrypt.hash('Admin@12345', 10);
      await User.create({
        name: 'Davis John Bila',
        email: 'admin@dalfam.co.tz',
        password: hashed,
        role: 'admin',
      });
      console.log('✅ Default admin created: admin@dalfam.co.tz / Admin@12345');
    }

    // Sample breeding stock
    const stockCount = await BreedingStock.count();
    if (stockCount === 0) {
      await BreedingStock.bulkCreate([
        { tagNumber: 'DF-SOW-001', name: 'Amani', breed: 'Large White', sex: 'female', status: 'active', weightKg: 145.5 },
        { tagNumber: 'DF-BOAR-001', name: 'Simba', breed: 'Landrace', sex: 'male', status: 'active', weightKg: 210.0 },
      ]);
      console.log('✅ Sample breeding stock created.');
    }

    // Sample tourism packages
    const pkgCount = await TourismPackage.count();
    if (pkgCount === 0) {
      await TourismPackage.bulkCreate([
        { name: 'Mbeya Highlands Nature Trail', description: 'A guided nature and cultural experience through the highlands.', category: 'nature', durationDays: 3, price: 450000, maxGuests: 12 },
        { name: 'Corporate Retreat Package', description: 'Planned logistics and site visit for organized company groups.', category: 'corporate', durationDays: 2, price: 900000, maxGuests: 25 },
      ]);
      console.log('✅ Sample tourism packages created.');
    }

    console.log('🌱 Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
