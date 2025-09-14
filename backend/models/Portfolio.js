const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required'],
    uppercase: true,
    trim: true,
    maxlength: [10, 'Symbol cannot exceed 10 characters']
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  averageBuyPrice: {
    type: Number,
    required: [true, 'Average buy price is required'],
    min: [0, 'Average buy price cannot be negative']
  },
  currentPrice: {
    type: Number,
    min: [0, 'Current price cannot be negative']
  },
  sector: {
    type: String,
    trim: true,
    maxlength: [50, 'Sector cannot exceed 50 characters']
  },
  industry: {
    type: String,
    trim: true,
    maxlength: [50, 'Industry cannot exceed 50 characters']
  },
  marketCap: {
    type: String,
    enum: ['Small Cap', 'Mid Cap', 'Large Cap', 'Mega Cap']
  },
  dividendYield: {
    type: Number,
    min: [0, 'Dividend yield cannot be negative'],
    max: [100, 'Dividend yield cannot exceed 100%']
  },
  transactions: [{
    type: {
      type: String,
      enum: ['buy', 'sell'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Transaction quantity cannot be negative']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Transaction price cannot be negative']
    },
    fees: {
      type: Number,
      default: 0,
      min: [0, 'Fees cannot be negative']
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Note cannot exceed 200 characters']
    }
  }],
  watchlist: {
    type: Boolean,
    default: false
  },
  alerts: [{
    type: {
      type: String,
      enum: ['price_above', 'price_below', 'volume_spike', 'news'],
      required: true
    },
    value: {
      type: Number,
      required: function() {
        return this.type === 'price_above' || this.type === 'price_below';
      }
    },
    triggered: {
      type: Boolean,
      default: false
    },
    triggeredDate: Date,
    active: {
      type: Boolean,
      default: true
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
portfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });
portfolioSchema.index({ userId: 1, watchlist: 1 });
portfolioSchema.index({ userId: 1, sector: 1 });
portfolioSchema.index({ symbol: 1 });

// Virtual for total invested amount
portfolioSchema.virtual('totalInvested').get(function() {
  return this.quantity * this.averageBuyPrice;
});

// Virtual for current value
portfolioSchema.virtual('currentValue').get(function() {
  return this.quantity * (this.currentPrice || this.averageBuyPrice);
});

// Virtual for profit/loss
portfolioSchema.virtual('profitLoss').get(function() {
  return this.currentValue - this.totalInvested;
});

// Virtual for profit/loss percentage
portfolioSchema.virtual('profitLossPercentage').get(function() {
  if (this.totalInvested === 0) return 0;
  return ((this.profitLoss / this.totalInvested) * 100);
});

// Method to add transaction
portfolioSchema.methods.addTransaction = function(transactionData) {
  this.transactions.push(transactionData);
  
  // Recalculate average buy price and quantity
  this.recalculateAverages();
  
  return this.save();
};

// Method to recalculate averages
portfolioSchema.methods.recalculateAverages = function() {
  let totalQuantity = 0;
  let totalInvestment = 0;
  
  this.transactions.forEach(transaction => {
    if (transaction.type === 'buy') {
      totalQuantity += transaction.quantity;
      totalInvestment += (transaction.quantity * transaction.price) + transaction.fees;
    } else if (transaction.type === 'sell') {
      totalQuantity -= transaction.quantity;
      // For sells, we reduce the total investment proportionally
      const sellRatio = transaction.quantity / (totalQuantity + transaction.quantity);
      totalInvestment -= totalInvestment * sellRatio;
    }
  });
  
  this.quantity = totalQuantity;
  this.averageBuyPrice = totalQuantity > 0 ? totalInvestment / totalQuantity : 0;
};

// Method to update current price
portfolioSchema.methods.updatePrice = function(newPrice) {
  this.currentPrice = newPrice;
  this.lastUpdated = new Date();
  
  // Check alerts
  this.checkAlerts(newPrice);
  
  return this.save();
};

// Method to check price alerts
portfolioSchema.methods.checkAlerts = function(currentPrice) {
  this.alerts.forEach(alert => {
    if (alert.active && !alert.triggered) {
      let shouldTrigger = false;
      
      if (alert.type === 'price_above' && currentPrice >= alert.value) {
        shouldTrigger = true;
      } else if (alert.type === 'price_below' && currentPrice <= alert.value) {
        shouldTrigger = true;
      }
      
      if (shouldTrigger) {
        alert.triggered = true;
        alert.triggeredDate = new Date();
      }
    }
  });
};

// Static method to get portfolio by user
portfolioSchema.statics.getByUser = function(userId) {
  return this.find({ userId, quantity: { $gt: 0 } }).sort({ symbol: 1 });
};

// Static method to get watchlist
portfolioSchema.statics.getWatchlist = function(userId) {
  return this.find({ userId, watchlist: true }).sort({ symbol: 1 });
};

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;