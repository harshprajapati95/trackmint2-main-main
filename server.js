const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection and routes
const connectDB = require('./backend/config/database');
const routes = require('./backend/routes');
const errorHandler = require('./backend/middleware/errorHandler');
const { apiLimiter } = require('./backend/middleware/rateLimiter');

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] // Add your production domain
    : true, // Allow all origins in development
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api', routes);

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  // Handle React Router - send all non-API requests to index.html
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: 'API endpoint not found'
      });
    }
    
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // Development mode - just serve API
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'TrackMint API Server is running in development mode',
      docs: '/api/health'
    });
  });
}

// Error handling middleware (should be last)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

const server = app.listen(port, () => {
  console.log(`🚀 TrackMint server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Health Check: http://localhost:${port}/api/health`);
});
