const { Portfolio } = require('../models');

// @desc    Get user's portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    const { includeWatchlist = false } = req.query;

    let query = { userId: req.user.id };
    
    if (!includeWatchlist) {
      query.quantity = { $gt: 0 };
    }

    const portfolio = await Portfolio.find(query).sort({ symbol: 1 });

    res.json({
      success: true,
      data: { portfolio }
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio'
    });
  }
};

// @desc    Get portfolio item by ID
// @route   GET /api/portfolio/:id
// @access  Private
const getPortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    res.json({
      success: true,
      data: { item }
    });
  } catch (error) {
    console.error('Get portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio item'
    });
  }
};

// @desc    Add stock to portfolio
// @route   POST /api/portfolio
// @access  Private
const addToPortfolio = async (req, res) => {
  try {
    const portfolioData = {
      ...req.body,
      userId: req.user.id
    };

    // Check if stock already exists in portfolio
    const existingItem = await Portfolio.findOne({
      userId: req.user.id,
      symbol: portfolioData.symbol.toUpperCase()
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Stock already exists in portfolio. Use update endpoint to modify.'
      });
    }

    // Create initial transaction
    if (portfolioData.quantity > 0) {
      portfolioData.transactions = [{
        type: 'buy',
        quantity: portfolioData.quantity,
        price: portfolioData.averageBuyPrice,
        date: new Date(),
        note: 'Initial purchase'
      }];
    }

    const portfolioItem = await Portfolio.create(portfolioData);

    res.status(201).json({
      success: true,
      message: 'Stock added to portfolio successfully',
      data: { portfolioItem }
    });
  } catch (error) {
    console.error('Add to portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding stock to portfolio',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private
const updatePortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    res.json({
      success: true,
      message: 'Portfolio item updated successfully',
      data: { item }
    });
  } catch (error) {
    console.error('Update portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating portfolio item'
    });
  }
};

// @desc    Remove from portfolio
// @route   DELETE /api/portfolio/:id
// @access  Private
const removeFromPortfolio = async (req, res) => {
  try {
    const item = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    res.json({
      success: true,
      message: 'Stock removed from portfolio successfully'
    });
  } catch (error) {
    console.error('Remove from portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing stock from portfolio'
    });
  }
};

// @desc    Add transaction to portfolio item
// @route   POST /api/portfolio/:id/transaction
// @access  Private
const addTransaction = async (req, res) => {
  try {
    const { type, quantity, price, fees = 0, note } = req.body;

    if (!type || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: 'Transaction type, quantity, and price are required'
      });
    }

    if (quantity <= 0 || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity and price must be greater than 0'
      });
    }

    const item = await Portfolio.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    // Check if selling more than owned
    if (type === 'sell' && quantity > item.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Cannot sell more shares than owned'
      });
    }

    const transactionData = {
      type,
      quantity,
      price,
      fees,
      note,
      date: new Date()
    };

    await item.addTransaction(transactionData);

    res.json({
      success: true,
      message: 'Transaction added successfully',
      data: { item }
    });
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding transaction'
    });
  }
};

// @desc    Update stock price
// @route   PUT /api/portfolio/:id/price
// @access  Private
const updatePrice = async (req, res) => {
  try {
    const { currentPrice } = req.body;

    if (!currentPrice || currentPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid current price is required'
      });
    }

    const item = await Portfolio.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    await item.updatePrice(currentPrice);

    res.json({
      success: true,
      message: 'Price updated successfully',
      data: { item }
    });
  } catch (error) {
    console.error('Update price error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating price'
    });
  }
};

// @desc    Get portfolio statistics
// @route   GET /api/portfolio/stats
// @access  Private
const getPortfolioStats = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ 
      userId: req.user.id, 
      quantity: { $gt: 0 } 
    });

    const stats = {
      totalStocks: portfolio.length,
      totalInvested: 0,
      currentValue: 0,
      totalProfitLoss: 0,
      totalProfitLossPercentage: 0,
      sectorBreakdown: {},
      topPerformers: [],
      worstPerformers: []
    };

    portfolio.forEach(item => {
      const invested = item.totalInvested;
      const current = item.currentValue;
      const profitLoss = item.profitLoss;
      const profitLossPercentage = item.profitLossPercentage;

      stats.totalInvested += invested;
      stats.currentValue += current;
      stats.totalProfitLoss += profitLoss;

      // Sector breakdown
      if (item.sector) {
        if (!stats.sectorBreakdown[item.sector]) {
          stats.sectorBreakdown[item.sector] = {
            count: 0,
            invested: 0,
            currentValue: 0
          };
        }
        stats.sectorBreakdown[item.sector].count++;
        stats.sectorBreakdown[item.sector].invested += invested;
        stats.sectorBreakdown[item.sector].currentValue += current;
      }

      // Track performance
      if (item.quantity > 0) {
        const performanceData = {
          symbol: item.symbol,
          companyName: item.companyName,
          profitLoss,
          profitLossPercentage,
          currentValue: current
        };

        if (profitLossPercentage > 0) {
          stats.topPerformers.push(performanceData);
        } else if (profitLossPercentage < 0) {
          stats.worstPerformers.push(performanceData);
        }
      }
    });

    // Calculate total profit/loss percentage
    if (stats.totalInvested > 0) {
      stats.totalProfitLossPercentage = (stats.totalProfitLoss / stats.totalInvested) * 100;
    }

    // Sort performers
    stats.topPerformers.sort((a, b) => b.profitLossPercentage - a.profitLossPercentage);
    stats.worstPerformers.sort((a, b) => a.profitLossPercentage - b.profitLossPercentage);

    // Limit to top 5
    stats.topPerformers = stats.topPerformers.slice(0, 5);
    stats.worstPerformers = stats.worstPerformers.slice(0, 5);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get portfolio stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio statistics'
    });
  }
};

// @desc    Get watchlist
// @route   GET /api/portfolio/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Portfolio.getWatchlist(req.user.id);

    res.json({
      success: true,
      data: { watchlist }
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching watchlist'
    });
  }
};

// @desc    Toggle watchlist status
// @route   PUT /api/portfolio/:id/watchlist
// @access  Private
const toggleWatchlist = async (req, res) => {
  try {
    const item = await Portfolio.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    item.watchlist = !item.watchlist;
    await item.save();

    res.json({
      success: true,
      message: `${item.watchlist ? 'Added to' : 'Removed from'} watchlist`,
      data: { item }
    });
  } catch (error) {
    console.error('Toggle watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating watchlist'
    });
  }
};

module.exports = {
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
};