const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const ensureAdmin = require('./services/ensureAdmin');

dotenv.config();

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET === 'your_jwt_secret_key_change_this_in_production') {
  throw new Error('JWT_SECRET must be a strong random value of at least 32 characters');
}

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim()),
  credentials: true
}));
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false }), require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? 'ok' : 'degraded',
    service: 'roomdekho-backend',
    database: dbReady ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime())
  });
});

// In production the backend can serve the built React app, giving RoomDekho
// one deployable application while API and MongoDB remain behind the same origin.
const frontendDist = path.resolve(__dirname, '../frontend/dist');
if (isProduction) {
  app.use(express.static(frontendDist));
}

app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.name === 'MulterError') {
    let message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') message = 'File too large. Maximum size is 5MB.';
    else if (err.code === 'LIMIT_UNEXPECTED_FILE') message = 'Unexpected file field. Please use the "images" field for uploads.';
    return res.status(400).json({ message });
  }
  if (err.message === 'Only image files are allowed') return res.status(400).json({ message: err.message });
  res.status(500).json({ message: 'Something went wrong!' });
});

if (isProduction) {
  app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

const start = async () => {
  await connectDB();
  await ensureAdmin();
  const server = app.listen(PORT, () => console.log(`RoomDekho server running on port ${PORT}`));

  const shutdown = (signal) => {
    console.log(`${signal} received, closing server gracefully...`);
    server.close(() => {
      mongoose.connection.close(false).finally(() => process.exit(0));
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start().catch((error) => {
  console.error('Failed to start RoomDekho:', error);
  process.exit(1);
});
