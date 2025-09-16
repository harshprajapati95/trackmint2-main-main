import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Target, Calendar, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { goalsAPI } from '../../api/client';

// Map frontend categories to backend categories
const getCategoryMapping = (frontendCategory) => {
  const mapping = {
    'savings': 'Emergency Fund',
    'vacation': 'Vacation',
    'home': 'Home Purchase',
    'car': 'Car Purchase',
    'education': 'Education',
    'retirement': 'Retirement',
    'investment': 'Investment',
    'debt': 'Debt Payoff',
    'wedding': 'Wedding',
    'health': 'Health & Fitness',
    'technology': 'Technology',
    'other': 'Other'
  };
  return mapping[frontendCategory] || 'Other';
};

const GoalsTab = ({ userData }) => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    category: 'savings',
    priority: 'medium',
    targetDate: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsAPI.getGoals();
      setGoals(response?.data?.goals || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to load goals');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateGoalMetrics = () => {
    // Ensure goals is an array
    const goalsArray = Array.isArray(goals) ? goals : [];
    
    const totalGoals = goalsArray.length;
    const completedGoals = goalsArray.filter(goal => (goal.currentAmount || 0) >= (goal.targetAmount || 0)).length;
    const totalTargetAmount = goalsArray.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0);
    const totalCurrentAmount = goalsArray.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
    const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

    return {
      totalGoals,
      completedGoals,
      totalTargetAmount,
      totalCurrentAmount,
      overallProgress
    };
  };

  const goalMetrics = calculateGoalMetrics();

  const calculateGoalProgress = (goal) => {
    // Add defensive checks
    const currentAmount = goal?.currentAmount || 0;
    const targetAmount = goal?.targetAmount || 1; // Avoid division by zero
    const targetDate = goal?.targetDate || new Date().toISOString();
    
    const progress = (currentAmount / targetAmount) * 100;
    const remaining = targetAmount - currentAmount;
    const daysRemaining = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
    const monthlySavingsNeeded = remaining > 0 && daysRemaining > 0 ? (remaining / (daysRemaining / 30)) : 0;
    
    return {
      progress: Math.min(progress, 100),
      remaining,
      daysRemaining,
      monthlySavingsNeeded,
      isCompleted: currentAmount >= targetAmount,
      isOverdue: new Date(targetDate) < new Date() && currentAmount < targetAmount
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetAmount = parseFloat(formData.targetAmount);
    const currentAmount = parseFloat(formData.currentAmount) || 0;
    
    if (!formData.title || !targetAmount || !formData.targetDate || targetAmount <= 0) {
      alert('Please fill all required fields with valid data');
      return;
    }

    const goalData = {
      title: formData.title,
      description: formData.description,
      targetAmount,
      currentAmount,
      targetDate: formData.targetDate,
      category: getCategoryMapping(formData.category),
      priority: formData.priority
    };

    try {
      if (editingGoal) {
        await goalsAPI.updateGoal(editingGoal._id, goalData);
      } else {
        await goalsAPI.createGoal(goalData);
      }
      
      // Refresh goals list
      await fetchGoals();
      
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: '',
        category: 'savings',
        priority: 'medium'
      });
      setShowForm(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Failed to save goal. Please try again.');
    }
  };

  const handleEdit = (goal) => {
    // Map backend category to frontend category
    const frontendCategory = Object.entries({
      'savings': 'Emergency Fund',
      'vacation': 'Vacation',
      'home': 'Home Purchase',
      'car': 'Car Purchase',
      'education': 'Education',
      'retirement': 'Retirement',
      'investment': 'Investment',
      'debt': 'Debt Payoff',
      'wedding': 'Wedding',
      'health': 'Health & Fitness',
      'technology': 'Technology',
      'other': 'Other'
    }).find(([frontend, backend]) => backend === goal.category)?.[0] || 'other';
    
    setEditingGoal(goal);
    setFormData({
      title: goal.title || '',
      description: goal.description || '',
      targetAmount: (goal.targetAmount || 0).toString(),
      currentAmount: (goal.currentAmount || 0).toString(),
      targetDate: goal.targetDate || '',
      category: frontendCategory,
      priority: goal.priority || 'medium'
    });
    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsAPI.deleteGoal(goalId);
        await fetchGoals(); // Refresh the goals list
      } catch (error) {
        console.error('Error deleting goal:', error);
        alert('Failed to delete goal. Please try again.');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-400 to-red-600';
      case 'medium': return 'from-yellow-400 to-yellow-600';
      case 'low': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'savings': return '💰';
      case 'investment': return '📈';
      case 'emergency': return '🛡️';
      case 'travel': return '✈️';
      case 'home': return '🏠';
      case 'education': return '🎓';
      default: return '🎯';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Financial Goals
            </h1>
            <p className="text-slate-600">Set and track your financial milestones</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Goal
          </button>
        </div>
      </div>

      {/* Goals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Target size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Total Goals</h3>
              <p className="text-sm text-slate-500">Active goals</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{goalMetrics.totalGoals}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Completed</h3>
              <p className="text-sm text-slate-500">Achieved goals</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{goalMetrics.completedGoals}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Target Amount</h3>
              <p className="text-sm text-slate-500">Total target</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">₹{goalMetrics.totalTargetAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Progress</h3>
              <p className="text-sm text-slate-500">Overall completion</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{goalMetrics.overallProgress.toFixed(1)}%</p>
        </div>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Amount (₹)</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Amount (₹)</label>
                <input
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
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
                  <option value="savings">Emergency Fund</option>
                  <option value="vacation">Vacation</option>
                  <option value="home">Home Purchase</option>
                  <option value="car">Car Purchase</option>
                  <option value="education">Education</option>
                  <option value="retirement">Retirement</option>
                  <option value="investment">Investment</option>
                  <option value="debt">Debt Payoff</option>
                  <option value="wedding">Wedding</option>
                  <option value="health">Health & Fitness</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Add any notes or details about this goal..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                {editingGoal ? 'Update Goal' : 'Add Goal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingGoal(null);
                  setFormData({
                    title: '',
                    description: '',
                    targetAmount: '',
                    currentAmount: '',
                    targetDate: '',
                    category: 'savings',
                    priority: 'medium'
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

      {/* Goals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading goals...</p>
          </div>
        ) : error ? (
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchGoals}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !Array.isArray(goals) || goals.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={24} className="text-white" />
            </div>
            <p className="text-slate-600">No goals set yet</p>
            <p className="text-sm text-slate-500 mt-1">Start planning your financial future by setting your first goal</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateGoalProgress(goal);
            return (
              <div key={goal._id || goal.id} className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getPriorityColor(goal.priority)} rounded-xl flex items-center justify-center`}>
                      <span className="text-white text-xl">{getCategoryIcon(goal.category)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">{goal.title}</h4>
                      <p className="text-sm text-slate-500">{goal.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full capitalize">
                          {goal.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          goal.priority === 'high' ? 'bg-red-100 text-red-600' :
                          goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {goal.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id || goal.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-semibold">
                      ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        progress.isCompleted ? 'bg-green-500' : 
                        progress.isOverdue ? 'bg-red-500' : 
                        'bg-blue-500'
                      }`}
                      style={{ width: `${progress.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-semibold ${
                      progress.isCompleted ? 'text-green-600' : 
                      progress.isOverdue ? 'text-red-600' : 
                      'text-blue-600'
                    }`}>
                      {progress.progress.toFixed(1)}% complete
                    </span>
                    <span className="text-slate-500">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                  </div>
                  {!progress.isCompleted && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                      {progress.daysRemaining > 0 ? (
                        <>
                          <span className="font-medium">{progress.daysRemaining} days remaining</span>
                          {progress.monthlySavingsNeeded > 0 && (
                            <span> • Need to save ₹{progress.monthlySavingsNeeded.toLocaleString()}/month</span>
                          )}
                        </>
                      ) : (
                        <span className="text-red-600 font-medium">Goal overdue</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalsTab;
