import React, { useState } from 'react';
import { DollarSign, Briefcase, Calculator, TrendingUp } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';

const IncomeEntry = () => {
  const { userData, dispatch, actions } = useWizard();
  const [income, setIncome] = useState(userData.income);

  const handleIncomeChange = (field, value) => {
    const updatedIncome = { ...income, [field]: value };
    
    // Auto-calculate annual/monthly based on input
    if (field === 'monthly') {
      updatedIncome.annual = value * 12;
    } else if (field === 'annual') {
      updatedIncome.monthly = value / 12;
    }
    
    setIncome(updatedIncome);
    dispatch({ type: actions.UPDATE_INCOME, payload: updatedIncome });
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <DollarSign size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's start with your income</h2>
        <p className="text-gray-600 text-lg">Enter your monthly or annual income to begin your financial planning journey</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Briefcase size={18} className="text-emerald-600" />
                Income Source
              </label>
              <select 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                value={income.source}
                onChange={(e) => handleIncomeChange('source', e.target.value)}
              >
                <option value="salary">Salary</option>
                <option value="business">Business</option>
                <option value="freelance">Freelancing</option>
                <option value="multiple">Multiple Sources</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calculator size={18} className="text-emerald-600" />
                  Monthly Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    placeholder="50,000"
                    value={income.monthly || ''}
                    onChange={(e) => handleIncomeChange('monthly', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp size={18} className="text-emerald-600" />
                  Annual Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    placeholder="6,00,000"
                    value={income.annual || ''}
                    onChange={(e) => handleIncomeChange('annual', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {income.monthly > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-600" />
                  Income Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <span className="text-gray-600 text-sm">Monthly</span>
                    <p className="font-bold text-emerald-600 text-lg">₹{income.monthly.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-600 text-sm">Annual</span>
                    <p className="font-bold text-emerald-600 text-lg">₹{income.annual.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 mb-4">
              💡 Your income information is used to create personalized budget recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeEntry;
