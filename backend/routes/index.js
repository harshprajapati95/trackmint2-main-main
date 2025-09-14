const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const expenseRoutes = require('./expenses');
const goalRoutes = require('./goals');
const portfolioRoutes = require('./portfolio');

// Mount routes
router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/goals', goalRoutes);
router.use('/portfolio', portfolioRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TrackMint API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;