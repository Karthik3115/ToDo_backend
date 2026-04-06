require('dotenv').config();
// Restarting to pick up local DB connection...
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const statusRoutes = require('./routes/statusRoutes');

const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────
connectDB();

// ── Global Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── MongoDB Connectivity Middleware ─────────────────────────────────
app.use((req, res, next) => {
  const mongoose = require('mongoose');
  const isConnected = mongoose.connection.readyState === 1;
  const isAuthOrUserRoute = req.originalUrl.startsWith('/api/auth') || req.originalUrl.startsWith('/api/user');
  
  if (isAuthOrUserRoute && !isConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database is currently unreachable. Please ensure your IP is whitelisted in MongoDB Atlas Network Access.',
      troubleshooting: 'Go to https://cloud.mongodb.com/ -> Network Access -> Add Current IP Address.'
    });
  }
  next();
});

// HTTP request logger (dev mode only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/status', statusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// ── 404 Handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Global Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Start Server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
});
