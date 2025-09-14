// Export all models from a single file for easier imports
const User = require('./User');
const Expense = require('./Expense');
const Goal = require('./Goal');
const Portfolio = require('./Portfolio');

module.exports = {
  User,
  Expense,
  Goal,
  Portfolio
};