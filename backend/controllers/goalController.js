const { Goal } = require('../models');

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const { status, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = { userId: req.user.id };

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const goals = await Goal.find(query).sort(sort);

    res.json({
      success: true,
      data: { goals }
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching goals'
    });
  }
};

// @desc    Get goal by ID
// @route   GET /api/goals/:id
// @access  Private
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.json({
      success: true,
      data: { goal }
    });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching goal'
    });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
  try {
    const goalData = {
      ...req.body,
      userId: req.user.id
    };

    // Create default milestones if not provided
    if (!goalData.milestones || goalData.milestones.length === 0) {
      goalData.milestones = [
        { percentage: 25, amount: goalData.targetAmount * 0.25 },
        { percentage: 50, amount: goalData.targetAmount * 0.5 },
        { percentage: 75, amount: goalData.targetAmount * 0.75 },
        { percentage: 100, amount: goalData.targetAmount }
      ];
    }

    const goal = await Goal.create(goalData);

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: { goal }
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating goal',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: { goal }
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating goal'
    });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting goal'
    });
  }
};

// @desc    Add contribution to goal
// @route   POST /api/goals/:id/contribute
// @access  Private
const addContribution = async (req, res) => {
  try {
    const { amount, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Contribution amount must be greater than 0'
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    if (goal.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot contribute to inactive goal'
      });
    }

    await goal.addContribution(amount, note);

    res.json({
      success: true,
      message: 'Contribution added successfully',
      data: { goal }
    });
  } catch (error) {
    console.error('Add contribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding contribution'
    });
  }
};

// @desc    Get goal statistics
// @route   GET /api/goals/stats
// @access  Private
const getGoalStats = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });

    const stats = {
      total: goals.length,
      active: goals.filter(g => g.status === 'active').length,
      completed: goals.filter(g => g.status === 'completed').length,
      paused: goals.filter(g => g.status === 'paused').length,
      totalTargetAmount: goals.reduce((sum, g) => sum + g.targetAmount, 0),
      totalCurrentAmount: goals.reduce((sum, g) => sum + g.currentAmount, 0),
      totalRemainingAmount: goals.reduce((sum, g) => sum + g.remainingAmount, 0),
      averageProgress: goals.length > 0 ? 
        goals.reduce((sum, g) => sum + g.progressPercentage, 0) / goals.length : 0,
      categoryBreakdown: {}
    };

    // Category breakdown
    goals.forEach(goal => {
      if (!stats.categoryBreakdown[goal.category]) {
        stats.categoryBreakdown[goal.category] = {
          count: 0,
          totalTarget: 0,
          totalCurrent: 0
        };
      }
      stats.categoryBreakdown[goal.category].count++;
      stats.categoryBreakdown[goal.category].totalTarget += goal.targetAmount;
      stats.categoryBreakdown[goal.category].totalCurrent += goal.currentAmount;
    });

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get goal stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching goal statistics'
    });
  }
};

module.exports = {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  addContribution,
  getGoalStats
};