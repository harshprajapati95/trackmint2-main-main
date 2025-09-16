import React, { useState } from 'react';
import { PieChart, Target, Settings, TrendingUp, CheckCircle } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';

const BudgetRuleSelection = () => {
  const { userData, dispatch, actions } = useWizard();
  const [selectedRule, setSelectedRule] = useState(userData.budgetRule);
  const [customBudget, setCustomBudget] = useState(userData.customBudget);

  const handleRuleChange = (rule) => {
    setSelectedRule(rule);
    dispatch({ type: actions.UPDATE_BUDGET_RULE, payload: rule });
  };

  const handleCustomBudgetChange = (field, value) => {
    const updated = { ...customBudget, [field]: parseInt(value) || 0 };
    
    // Ensure total doesn't exceed 100%
    const total = updated.needs + updated.wants + updated.savings;
    if (total <= 100) {
      setCustomBudget(updated);
      dispatch({ type: actions.UPDATE_CUSTOM_BUDGET, payload: updated });
    }
  };

  const customTotal = customBudget.needs + customBudget.wants + customBudget.savings;
  const monthlyIncome = userData.income.monthly || 0;

  const rules = [
    {
      id: '50-30-20',
      title: '50-30-20 Rule',
      subtitle: 'Popular & Balanced',
      description: 'Spend 50% on needs, 30% on wants, save 20%',
      icon: Target,
      breakdown: { needs: 50, wants: 30, savings: 20 },
      recommended: true,
    },
    {
      id: '60-20-20',
      title: '60-20-20 Rule',
      subtitle: 'Moderate Saving',
      description: 'Spend 60% on needs, 20% on wants, save 20%',
      icon: TrendingUp,
      breakdown: { needs: 60, wants: 20, savings: 20 },
    },
    {
      id: 'custom',
      title: 'Custom Rule',
      subtitle: 'Personalized',
      description: 'Create your own budget allocation',
      icon: Settings,
      breakdown: customBudget,
    },
  ];

  const calculateAmount = (percentage) => {
    return (monthlyIncome * percentage / 100).toLocaleString();
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <PieChart size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose your budget rule</h2>
        <p className="text-gray-600 text-lg">Select a budgeting method that aligns with your financial goals</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {rules.map((rule) => {
            const Icon = rule.icon;
            const isSelected = selectedRule === rule.id;
            
            return (
              <div
                key={rule.id}
                className={`relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 border-2 ${
                  isSelected 
                    ? 'border-emerald-500 shadow-xl transform scale-105' 
                    : 'border-gray-200 hover:border-emerald-300 hover:shadow-xl'
                }`}
                onClick={() => handleRuleChange(rule.id)}
              >
                {rule.recommended && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Recommended
                  </div>
                )}
                
                {isSelected && (
                  <div className="absolute -top-3 -left-3 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle size={20} />
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${
                    isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-emerald-500'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{rule.title}</h3>
                  <p className="text-xs text-emerald-600 font-medium">{rule.subtitle}</p>
                  <p className="text-sm text-gray-600 mt-2">{rule.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Needs</span>
                    <span className="font-semibold text-gray-900">{rule.breakdown.needs}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Wants</span>
                    <span className="font-semibold text-gray-900">{rule.breakdown.wants}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Savings</span>
                    <span className="font-semibold text-green-600">{rule.breakdown.savings}%</span>
                  </div>
                </div>

                {monthlyIncome > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Monthly Allocation:</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Needs:</span>
                        <span className="font-semibold">₹{calculateAmount(rule.breakdown.needs)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wants:</span>
                        <span className="font-semibold">₹{calculateAmount(rule.breakdown.wants)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Savings:</span>
                        <span className="font-semibold text-green-600">₹{calculateAmount(rule.breakdown.savings)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedRule === 'custom' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-6 text-center text-xl">Customize Your Budget</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Needs ({customBudget.needs}%)
                </label>
                <input
                  type="range"
                  min="30"
                  max="70"
                  value={customBudget.needs}
                  onChange={(e) => handleCustomBudgetChange('needs', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30%</span>
                  <span>70%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wants ({customBudget.wants}%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={customBudget.wants}
                  onChange={(e) => handleCustomBudgetChange('wants', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Savings ({customBudget.savings}%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={customBudget.savings}
                  onChange={(e) => handleCustomBudgetChange('savings', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>40%</span>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                customTotal === 100 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-amber-50 border border-amber-200'
              }`}>
                <p className={`text-sm font-semibold ${
                  customTotal === 100 ? 'text-green-700' : 'text-amber-700'
                }`}>
                  Total: {customTotal}%
                  {customTotal !== 100 && ` (${100 - customTotal}% ${customTotal > 100 ? 'over' : 'remaining'})`}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            💡 The 50-30-20 rule is recommended for beginners and provides a balanced approach to budgeting
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetRuleSelection;
