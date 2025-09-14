const express = require('express');
const router = express.Router();
const {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  addContribution,
  getGoalStats
} = require('../controllers/goalController');
const auth = require('../middleware/auth');

// All routes are private (require authentication)
router.use(auth);

// @route   GET /api/goals/stats
// @desc    Get goal statistics
// @access  Private
router.get('/stats', getGoalStats);

// @route   GET /api/goals
// @desc    Get all goals for user
// @access  Private
router.get('/', getGoals);

// @route   POST /api/goals
// @desc    Create new goal
// @access  Private
router.post('/', createGoal);

// @route   GET /api/goals/:id
// @desc    Get goal by ID
// @access  Private
router.get('/:id', getGoalById);

// @route   PUT /api/goals/:id
// @desc    Update goal
// @access  Private
router.put('/:id', updateGoal);

// @route   DELETE /api/goals/:id
// @desc    Delete goal
// @access  Private
router.delete('/:id', deleteGoal);

// @route   POST /api/goals/:id/contribute
// @desc    Add contribution to goal
// @access  Private
router.post('/:id/contribute', addContribution);

module.exports = router;