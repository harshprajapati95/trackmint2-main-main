const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount cannot be negative']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Emergency Fund',
      'Vacation',
      'Home Purchase',
      'Car Purchase',
      'Education',
      'Retirement',
      'Investment',
      'Debt Payoff',
      'Wedding',
      'Health & Fitness',
      'Technology',
      'Other'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  monthlyContribution: {
    type: Number,
    min: [0, 'Monthly contribution cannot be negative']
  },
  autoContribute: {
    type: Boolean,
    default: false
  },
  contributions: [{
    amount: {
      type: Number,
      required: true,
      min: [0, 'Contribution amount cannot be negative']
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Note cannot exceed 200 characters']
    }
  }],
  milestones: [{
    percentage: {
      type: Number,
      required: true,
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100']
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    },
    achieved: {
      type: Boolean,
      default: false
    },
    achievedDate: Date,
    reward: {
      type: String,
      trim: true,
      maxlength: [100, 'Reward cannot exceed 100 characters']
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, targetDate: 1 });
goalSchema.index({ userId: 1, priority: 1 });
goalSchema.index({ userId: 1, createdAt: -1 });

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function() {
  if (this.targetAmount === 0) return 0;
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

// Virtual for remaining amount
goalSchema.virtual('remainingAmount').get(function() {
  return Math.max(this.targetAmount - this.currentAmount, 0);
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
  const today = new Date();
  const targetDate = new Date(this.targetDate);
  const timeDiff = targetDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Virtual for monthly required savings
goalSchema.virtual('monthlyRequiredSavings').get(function() {
  const remaining = this.remainingAmount;
  const daysLeft = this.daysRemaining;
  const monthsLeft = Math.max(daysLeft / 30, 1);
  return Math.ceil(remaining / monthsLeft);
});

// Method to add contribution
goalSchema.methods.addContribution = function(amount, note = '') {
  this.contributions.push({
    amount,
    note,
    date: new Date()
  });
  this.currentAmount += amount;
  
  // Check if goal is completed
  if (this.currentAmount >= this.targetAmount) {
    this.status = 'completed';
  }
  
  // Update milestones
  this.updateMilestones();
  
  return this.save();
};

// Method to update milestones
goalSchema.methods.updateMilestones = function() {
  const progressPercentage = this.progressPercentage;
  
  this.milestones.forEach(milestone => {
    if (!milestone.achieved && progressPercentage >= milestone.percentage) {
      milestone.achieved = true;
      milestone.achievedDate = new Date();
    }
  });
};

// Static method to get active goals by user
goalSchema.statics.getActiveByUser = function(userId) {
  return this.find({ userId, status: 'active' }).sort({ priority: 1, targetDate: 1 });
};

// Static method to get goals by category
goalSchema.statics.getByCategory = function(userId, category) {
  return this.find({ userId, category }).sort({ createdAt: -1 });
};

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;