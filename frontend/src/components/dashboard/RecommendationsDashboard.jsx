import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Target, ArrowRight, ExternalLink, Plus } from 'lucide-react';
import { generateRecommendations, calculateBudgetAllocation } from '../../context/WizardContext';
import { useBudget } from '../../context/BudgetContext';

const RecommendationsDashboard = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('stocks');
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (userData?.riskAppetite) {
        try {
          const allocation = calculateBudgetAllocation(
            userData.income,
            userData.budgetRule,
            userData.customBudget
          );
          const recs = await generateRecommendations(userData.riskAppetite, allocation);
          setRecommendations(recs);
        } catch (error) {
          console.error('Error loading recommendations:', error);
        }
      }
    };

    loadRecommendations();
  }, [userData]);

  const tabs = [
    { id: 'stocks', label: 'Stocks', icon: TrendingUp },
    { id: 'mutualFunds', label: 'Mutual Funds', icon: BarChart3 },
    { id: 'bonds', label: 'Bonds', icon: Target }
  ];

  const renderStocks = () => (
    <div className="space-y-3">
      {recommendations?.stocks?.slice(0, 5).map((stock, index) => (
        <div
          key={stock.symbol || index}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">{stock.symbol}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Stock
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{stock.description || 'Technology Company'}</p>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{(stock.currentPrice || 0).toFixed(2)}
                  </span>
                </div>
                <div className={`flex items-center gap-1 ${
                  (stock.changePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(stock.changePercent || 0) >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span className="font-semibold">
                    {(stock.changePercent || 0) >= 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMutualFunds = () => (
    <div className="space-y-3">
      {recommendations?.mutualFunds?.slice(0, 5).map((fund, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-green-300"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900 text-sm">{fund.name}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {fund.category}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <span className="text-xs text-gray-500">Expected Return</span>
                  <p className="font-semibold text-green-600">{fund.expectedReturn}</p>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <BarChart3 size={14} />
                  <span className="text-xs">{fund.riskLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBonds = () => (
    <div className="space-y-3">
      {recommendations?.bonds?.slice(0, 5).map((bond, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-purple-300"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900 text-sm">{bond.name}</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  Bond
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <span className="text-xs text-gray-500">Yield</span>
                  <p className="font-semibold text-purple-600">{bond.yield}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Maturity</span>
                  <p className="font-semibold text-gray-700">{bond.maturity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!recommendations) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Investment Recommendations
        </h1>
        <p className="text-slate-600">
          Personalized investment suggestions based on your {userData?.riskAppetite?.toLowerCase() || 'balanced'} risk profile
        </p> */}
      </div>

      {/* Risk Profile Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/30">
        <h3 className="text-lg font-bold text-slate-800 mb-3">Your Investment Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-blue-600" />
              <span className="font-semibold text-slate-800">Risk Appetite</span>
            </div>
            <p className="text-lg font-bold text-blue-600 capitalize">{userData?.riskAppetite || 'Balanced'}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-green-600" />
              <span className="font-semibold text-slate-800">Investment Budget</span>
            </div>
            <p className="text-lg font-bold text-green-600">
              ₹{calculateBudgetAllocation(userData.income, userData.budgetRule, userData.customBudget).savings.toLocaleString()}/month
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={18} className="text-purple-600" />
              <span className="font-semibold text-slate-800">Goals</span>
            </div>
            <p className="text-sm text-slate-600">
              {userData?.investmentGoals?.length ? userData.investmentGoals.join(', ') : 'Wealth building'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
        {activeTab === 'stocks' && renderStocks()}
        {activeTab === 'mutualFunds' && renderMutualFunds()}
        {activeTab === 'bonds' && renderBonds()}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-yellow-800 text-sm font-bold">⚠</span>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Investment Disclaimer</h4>
            <p className="text-sm text-yellow-700">
              These recommendations are based on your risk profile and are for educational purposes only. 
              Past performance does not guarantee future results. Please consult with a financial advisor 
              before making investment decisions and conduct your own research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsDashboard;
