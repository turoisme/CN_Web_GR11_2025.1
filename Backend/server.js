const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers

// CORS configuration - support Vercel and local development
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.VERCEL_URL 
    ? (origin, callback) => {
        // Allow requests from CLIENT_URL, VERCEL_URL, or localhost
        const allowed = [
          process.env.CLIENT_URL,
          process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
          'http://localhost:3000',
          'http://localhost:3001'
        ].filter(Boolean);
        
        if (!origin || allowed.some(url => origin.startsWith(url)) || process.env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          callback(null, true); // Allow all for Vercel compatibility
        }
      }
    : true, // Allow all in development
  credentials: true
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'FilmRate API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server only if not in serverless environment
if (process.env.VERCEL !== '1' && !process.env.LAMBDA_TASK_ROOT) {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api`);
    console.log('='.repeat(50));
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
}

module.exports = app;