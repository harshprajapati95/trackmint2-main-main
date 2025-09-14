const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  getPortfolioItem,
  addToPortfolio,
  updatePortfolioItem,
  removeFromPortfolio,
  addTransaction,
  updatePrice,
  getPortfolioStats,
  getWatchlist,
  toggleWatchlist
} = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

// All routes are private (require authentication)
router.use(auth);

// @route   GET /api/portfolio/stats
// @desc    Get portfolio statistics
// @access  Private
router.get('/stats', getPortfolioStats);

// @route   GET /api/portfolio/watchlist
// @desc    Get watchlist
// @access  Private
router.get('/watchlist', getWatchlist);

// @route   GET /api/portfolio
// @desc    Get user's portfolio
// @access  Private
router.get('/', getPortfolio);

// @route   POST /api/portfolio
// @desc    Add stock to portfolio
// @access  Private
router.post('/', addToPortfolio);

// @route   GET /api/portfolio/:id
// @desc    Get portfolio item by ID
// @access  Private
router.get('/:id', getPortfolioItem);

// @route   PUT /api/portfolio/:id
// @desc    Update portfolio item
// @access  Private
router.put('/:id', updatePortfolioItem);

// @route   DELETE /api/portfolio/:id
// @desc    Remove from portfolio
// @access  Private
router.delete('/:id', removeFromPortfolio);

// @route   POST /api/portfolio/:id/transaction
// @desc    Add transaction to portfolio item
// @access  Private
router.post('/:id/transaction', addTransaction);

// @route   PUT /api/portfolio/:id/price
// @desc    Update stock price
// @access  Private
router.put('/:id/price', updatePrice);

// @route   PUT /api/portfolio/:id/watchlist
// @desc    Toggle watchlist status
// @access  Private
router.put('/:id/watchlist', toggleWatchlist);

module.exports = router;