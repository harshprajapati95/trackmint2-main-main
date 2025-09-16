import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Trash2, Calculator, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { useWizard, calculateBudgetAllocation } from '../../context/WizardContext';

const ExpensesAllocation = () => {
  const { userData, dispatch, actions } = useWizard();
  const [expenses, setExpenses] = useState(userData.expenses);
  const [newExpense, setNewExpense] = useState({ category: 'needs', name: '', amount: '' });

  const budgetAllocation = calculateBudgetAllocation(
    userData.income,
    userData.budgetRule,
    userData.customBudget
  );

  useEffect(() => {
    dispatch({ type: actions.UPDATE_EXPENSES, payload: expenses });
  }, [expenses, dispatch, actions]);

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      const expense = {
        id: Date.now(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
      };

      const updatedExpenses = {
        ...expenses,
        [newExpense.category]: [...expenses[newExpense.category], expense],
      };

      // Recalculate totals
      updatedExpenses.totalNeeds = updatedExpenses.needs.reduce((sum, exp) => sum + exp.amount, 0);
      updatedExpenses.totalWants = updatedExpenses.wants.reduce((sum, exp) => sum + exp.amount, 0);

      setExpenses(updatedExpenses);
      setNewExpense({ category: 'needs', name: '', amount: '' });
    }
  };

  const removeExpense = (category, expenseId) => {
    const updatedExpenses = {
      ...expenses,
      [category]: expenses[category].filter(exp => exp.id !== expenseId),
    };

    // Recalculate totals
    updatedExpenses.totalNeeds = updatedExpenses.needs.reduce((sum, exp) => sum + exp.amount, 0);
    updatedExpenses.totalWants = updatedExpenses.wants.reduce((sum, exp) => sum + exp.amount, 0);

    setExpenses(updatedExpenses);
  };

  const savingsAmount = budgetAllocation.savings;
  const totalAllocated = expenses.totalNeeds + expenses.totalWants;
  const budgetUsed = ((totalAllocated / (budgetAllocation.needs + budgetAllocation.wants)) * 100) || 0;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Receipt size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Allocate your expenses</h2>
        <p className="text-gray-600 text-lg">Add your expected monthly expenses to see how they fit your budget</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expense Entry */}
          <div className="space-y-6">
            {/* Add New Expense */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
                <Plus size={20} className="text-emerald-600" />
                Add Expense
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  >
                    <option value="needs">Needs (Essential)</option>
                    <option value="wants">Wants (Lifestyle)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expense Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    placeholder="e.g., Groceries, Rent, Entertainment"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="number"
                      className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                      placeholder="5,000"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  className={`w-full bg-emerald-600 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    !newExpense.name || !newExpense.amount 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-emerald-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                  }`}
                  onClick={addExpense}
                  disabled={!newExpense.name || !newExpense.amount}
                >
                  <Plus size={18} />
                  Add Expense
                </button>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
                <Calculator size={20} className="text-emerald-600" />
                Budget Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-medium text-gray-700">Needs Budget</span>
                  <span className="font-bold text-blue-700">₹{budgetAllocation.needs.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="font-medium text-gray-700">Wants Budget</span>
                  <span className="font-bold text-purple-700">₹{budgetAllocation.wants.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <span className="font-medium text-gray-700">Savings</span>
                  <span className="font-bold text-green-700">₹{savingsAmount.toLocaleString()}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Budget Used</span>
                    <span className={`font-bold text-lg ${budgetUsed > 100 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {budgetUsed.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        budgetUsed > 100 ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Lists */}
          <div className="space-y-6">
            {/* Expense Lists */}
            {(expenses.needs.length > 0 || expenses.wants.length > 0) ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
                  <PieChartIcon size={20} className="text-emerald-600" />
                  Your Expenses
                </h3>
                
                {expenses.needs.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                      <TrendingUp size={16} />
                      Needs (₹{expenses.totalNeeds.toLocaleString()})
                    </h4>
                    <div className="space-y-2">
                      {expenses.needs.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="font-medium text-gray-700">{expense.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-blue-700">₹{expense.amount.toLocaleString()}</span>
                            <button
                              onClick={() => removeExpense('needs', expense.id)}
                              className="text-red-500 hover:bg-red-100 p-1 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {expenses.wants.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                      <TrendingUp size={16} />
                      Wants (₹{expenses.totalWants.toLocaleString()})
                    </h4>
                    <div className="space-y-2">
                      {expenses.wants.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <span className="font-medium text-gray-700">{expense.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-purple-700">₹{expense.amount.toLocaleString()}</span>
                            <button
                              onClick={() => removeExpense('wants', expense.id)}
                              className="text-red-500 hover:bg-red-100 p-1 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
                <PieChartIcon size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No expenses added yet</h3>
                <p className="text-gray-600">Start by adding your monthly expenses to see how they fit your budget</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            💡 Try to keep your total expenses within your budget allocation for better financial health
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpensesAllocation;
