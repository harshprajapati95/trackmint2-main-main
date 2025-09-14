import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, TrendingDown, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { calculateBudgetAllocation } from '../../context/WizardContext';
import { useBudget } from '../../context/BudgetContext';
import { expensesAPI } from '../../api/client';

// Map frontend categories to backend categories
const getCategoryMapping = (frontendCategory) => {
  const mapping = {
    'needs': 'Food & Dining', // Default for needs
    'wants': 'Entertainment',  // Default for wants
    'savings': 'Savings'       // Default for savings
  };
  return mapping[frontendCategory] || 'Other';
};

const ExpensesTab = ({ userData, onDataUpdate }) => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const { addExpense, removeExpense, getBudgetStatus } = useBudget();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'needs',
    date: new Date().toISOString().split('T')[0]
  });

  // Calculate budget allocation and get real-time budget status
  const budgetAllocation = calculateBudgetAllocation(
    userData.income,
    userData.budgetRule,
    userData.customBudget
  );

  const budgetStatus = getBudgetStatus();

  // Load expenses from database on component mount
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const result = await expensesAPI.getExpenses();
        if (result.success) {
          setExpenses(result.data.expenses || []);
        }
      } catch (error) {
        console.error('Error loading expenses:', error);
        // Fallback to localStorage if API fails
        const savedExpenses = localStorage.getItem('trackMint_expenses');
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses));
        }
      }
    };
    
    loadExpenses();
  }, []);

  // Calculate current month expenses by category
  const calculateCurrentMonthExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthExpenses = expenses.filter(expense => {
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const categorized = {
      needs: 0,
      wants: 0,
      savings: 0
    };

    currentMonthExpenses.forEach(expense => {
      categorized[expense.category] += (expense.amount || 0);
    });

    return categorized;
  };

  const currentExpenses = calculateCurrentMonthExpenses();
  const totalCurrentExpenses = Object.values(currentExpenses).reduce((sum, amount) => sum + amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    if (!formData.description || !amount || amount <= 0) {
      alert('Please fill all fields with valid data');
      return;
    }

    const expenseData = {
      title: formData.description,
      description: formData.description,
      amount: amount,
      category: getCategoryMapping(formData.category),
      subcategory: formData.category, // Store original category as subcategory
      date: formData.date,
    };

    try {
      if (editingExpense) {
        // Update existing expense
        const result = await expensesAPI.updateExpense(editingExpense.id || editingExpense._id, expenseData);
        if (result.success) {
          // Update local state
          setExpenses(expenses.map(exp => 
            (exp.id || exp._id) === (editingExpense.id || editingExpense._id) ? result.data : exp
          ));
          
          // Update budget tracking
          const oldExpense = expenses.find(exp => (exp.id || exp._id) === (editingExpense.id || editingExpense._id));
          if (oldExpense) {
            removeExpense(oldExpense.amount || 0, oldExpense.category);
          }
          addExpense(amount, formData.category);
        }
      } else {
        // Create new expense
        const result = await expensesAPI.createExpense(expenseData);
        if (result.success) {
          setExpenses([...expenses, result.data]);
          addExpense(amount, formData.category);
        }
      }

      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: 'needs',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      setEditingExpense(null);
      
    } catch (error) {
      console.error('Error saving expense:', error);
      let errorMessage = 'Error saving expense. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description || expense.title || '',
      amount: (expense.amount || 0).toString(),
      category: expense.subcategory || expense.category || 'needs',
      date: expense.date || new Date().toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const handleDelete = async (expenseId) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        const expenseToDelete = expenses.find(exp => (exp.id || exp._id) === expenseId);
        
        const result = await expensesAPI.deleteExpense(expenseId);
        if (result.success) {
          if (expenseToDelete) {
            // Add money back to budget
            removeExpense(expenseToDelete.amount, expenseToDelete.category);
            setExpenses(expenses.filter(exp => (exp.id || exp._id) !== expenseId));
          }
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense. Please try again.');
      }
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'needs': return 'from-blue-400 to-blue-600';
      case 'wants': return 'from-purple-400 to-purple-600';
      case 'savings': return 'from-emerald-400 to-emerald-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'needs': return '🏠';
      case 'wants': return '🎉';
      case 'savings': return '💰';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Expenses
            </h1>
            <p className="text-slate-600">Track and manage your spending</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(budgetStatus).map(([category, status]) => (
          <div key={category} className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(category)} rounded-xl flex items-center justify-center`}>
                  <span className="text-white text-xl">{getCategoryIcon(category)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 capitalize">{category}</h3>
                  <p className="text-sm text-slate-500">This month</p>
                </div>
              </div>
              {status.percentage > 100 && (
                <AlertTriangle size={20} className="text-red-500" />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Spent</span>
                <span className="font-semibold">₹{(category === 'savings' ? status.invested : status.spent).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Budget</span>
                <span className="font-semibold">₹{status.allocated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Remaining</span>
                <span className={`font-semibold ${status.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{status.remaining.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    status.percentage > 100 ? 'bg-red-500' : 
                    status.percentage > 80 ? 'bg-yellow-500' : 
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(status.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-semibold ${
                  status.percentage > 100 ? 'text-red-600' : 
                  status.percentage > 80 ? 'text-yellow-600' : 
                  'text-emerald-600'
                }`}>
                  {status.percentage.toFixed(1)}%
                </span>
                {status.percentage > 100 && (
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    Exceeded by ₹{Math.abs(status.remaining).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Expense Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="e.g., Groceries, Coffee, Investment"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="needs">Needs (Essentials)</option>
                  <option value="wants">Wants (Lifestyle)</option>
                  <option value="savings">Savings/Investment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingExpense(null);
                  setFormData({
                    description: '',
                    amount: '',
                    category: 'needs',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-300 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800">Recent Expenses</h3>
          <p className="text-slate-600 text-sm">Total: ₹{totalCurrentExpenses.toLocaleString()} this month</p>
        </div>
        
        {expenses.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign size={24} className="text-white" />
            </div>
            <p className="text-slate-600">No expenses recorded yet</p>
            <p className="text-sm text-slate-500 mt-1">Start tracking your spending by adding your first expense</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {expenses
              .sort((a, b) => {
                const dateA = a.date ? new Date(a.date) : new Date(0);
                const dateB = b.date ? new Date(b.date) : new Date(0);
                return dateB - dateA;
              })
              .slice(0, 20)
              .map((expense) => (
                <div key={expense._id || expense.id} className="p-4 hover:bg-slate-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getCategoryColor(expense.category)} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-sm">{getCategoryIcon(expense.category)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{expense.title || expense.description}</h4>
                        <p className="text-sm text-slate-500">
                          {expense.date ? new Date(expense.date).toLocaleDateString() : 'No date'} • {expense.subcategory || expense.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-800">₹{(expense.amount || 0).toLocaleString()}</span>
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesTab;
