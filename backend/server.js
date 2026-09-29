require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const breedingStockRoutes = require('./routes/breedingStockRoutes');
const litterRoutes = require('./routes/litterRoutes');
const healthRecordRoutes = require('./routes/healthRecordRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const path = require('path'); 
 const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Allow one or more comma-separated origins via CLIENT_URL (e.g. "http://localhost:5173,http://localhost:4173")
// Defaults cover both the Vite dev server (5173) and the Vite preview server (4173).
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', company: 'DALFAM COMPANY LTD', message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/breeding-stock', breedingStockRoutes);
app.use('/api/litters', litterRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/blog', blogRoutes); // NEW
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync models to database (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced.');

    app.listen(PORT, () => {
      console.log(`🚀 DALFAM API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Unable to start server:', err.message);
    process.exit(1);
  }
};

start();
