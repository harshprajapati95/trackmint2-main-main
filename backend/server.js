const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import database connection and routes
const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const port = process.env.PORT || 10000; // Render uses port 10000 by default

// Connect to MongoDB
connectDB();

// CORS configuration for production and development
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN || 'https://your-frontend-url.onrender.com'
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TrackMint API is running!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the frontend dist directory in production
// Note: For separate deployments, this section is not needed
// The frontend will be deployed as a separate static site
if (process.env.NODE_ENV === 'production' && process.env.SERVE_FRONTEND === 'true') {
  // Only serve frontend if explicitly enabled
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

  // Handle React Router - send all non-API requests to index.html
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: 'API endpoint not found'
      });
    }
    
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
} else {
  // API-only mode (default for separate deployments)
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'TrackMint API Server is running',
      environment: process.env.NODE_ENV || 'development',
      health: '/health',
      api: '/api/*'
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

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 TrackMint server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Health Check: http://localhost:${port}/health`);
  console.log(`🌐 CORS Origin: ${corsOptions.origin}`);
});
