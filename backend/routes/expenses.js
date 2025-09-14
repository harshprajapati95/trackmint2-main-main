const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');
const auth = require('../middleware/auth');

// All routes are private (require authentication)
router.use(auth);

// @route   GET /api/expenses/stats
// @desc    Get expense statistics
// @access  Private
router.get('/stats', getExpenseStats);

// @route   GET /api/expenses
// @desc    Get all expenses for user
// @access  Private
router.get('/', getExpenses);

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Private
router.post('/', createExpense);

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', getExpenseById);

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', updateExpense);

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', deleteExpense);

module.exports = router;