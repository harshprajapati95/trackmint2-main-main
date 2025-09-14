import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart } from 'lucide-react';
import { fetchStockQuote } from '../../api/finnhub';
import { portfolioAPI } from '../../api/client';

const PortfolioTab = ({ userData }) => {
  const [investments, setInvestments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks',
    symbol: '',
    quantity: '',
    buyPrice: '',
    currentPrice: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await portfolioAPI.getPortfolio();
      setInvestments(response?.data?.portfolio || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Failed to load portfolio');
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const calculatePortfolioMetrics = () => {
    // Ensure investments is an array
    const investmentsArray = Array.isArray(investments) ? investments : [];
    
    let totalValue = 0;
    let totalInvested = 0;
    let totalGainLoss = 0;

    const updatedInvestments = investmentsArray.map(investment => {
      const quantity = investment?.quantity || 0;
      const buyPrice = investment?.averageBuyPrice || 0;
      const currentPrice = investment?.symbol && stockPrices[investment.symbol] 
        ? stockPrices[investment.symbol] 
        : investment?.currentPrice || investment?.averageBuyPrice || 0;
      
      const currentValue = quantity * currentPrice;
      const investedValue = quantity * buyPrice;
      const gainLoss = currentValue - investedValue;
      const gainLossPercentage = investedValue > 0 ? (gainLoss / investedValue) * 100 : 0;

      totalValue += currentValue;
      totalInvested += investedValue;
      totalGainLoss += gainLoss;

      return {
        ...investment,
        currentPrice,
        currentValue,
        investedValue,
        gainLoss,
        gainLossPercentage
      };
    });

    const totalGainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return {
      updatedInvestments,
      totalValue,
      totalInvested,
      totalGainLoss,
      totalGainLossPercentage
    };
  };

  const portfolioMetrics = calculatePortfolioMetrics();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quantity = parseFloat(formData.quantity);
    const buyPrice = parseFloat(formData.buyPrice);
    const currentPrice = parseFloat(formData.currentPrice) || buyPrice;
    
    if (!formData.name || !quantity || !buyPrice || quantity <= 0 || buyPrice <= 0) {
      alert('Please fill all required fields with valid data');
      return;
    }

    const portfolioData = {
      symbol: formData.symbol || formData.name.substring(0, 10).toUpperCase(),
      companyName: formData.name,
      quantity,
      averageBuyPrice: buyPrice,
      currentPrice,
      transactions: [{
        type: 'buy',
        quantity,
        price: buyPrice,
        date: formData.date
      }]
    };

    const investmentAmount = quantity * buyPrice;
    
    // Check if user has enough savings budget for new investments
    const availableSavings = (userData?.savingsAmount || 0) - portfolioMetrics.totalInvested;
    const isNewInvestment = !editingInvestment;
    
    if (isNewInvestment && investmentAmount > availableSavings) {
      alert(`Insufficient savings budget! You have ₹${availableSavings.toLocaleString()} available for investments.`);
      return;
    }

    try {
      if (editingInvestment) {
        await portfolioAPI.updatePortfolioItem(editingInvestment._id, portfolioData);
      } else {
        await portfolioAPI.addToPortfolio(portfolioData);
      }
      
      // Refresh portfolio list
      await fetchPortfolio();
      
      setFormData({
        name: '',
        type: 'stocks',
        symbol: '',
        quantity: '',
        buyPrice: '',
        currentPrice: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      setEditingInvestment(null);
    } catch (error) {
      console.error('Error saving investment:', error);
      alert('Failed to save investment. Please try again.');
    }
  };

  const handleEdit = (investment) => {
    setEditingInvestment(investment);
    setFormData({
      name: investment.companyName || '',
      type: 'stocks', // Default since backend doesn't have type field
      symbol: investment.symbol || '',
      quantity: (investment.quantity || 0).toString(),
      buyPrice: (investment.averageBuyPrice || 0).toString(),
      currentPrice: (investment.currentPrice || investment.averageBuyPrice || 0).toString(),
      date: investment.transactions?.[0]?.date ? 
        new Date(investment.transactions[0].date).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const handleDelete = async (investmentId) => {
    if (confirm('Are you sure you want to delete this investment?')) {
      try {
        await portfolioAPI.removeFromPortfolio(investmentId);
        await fetchPortfolio(); // Refresh the portfolio list
      } catch (error) {
        console.error('Error deleting investment:', error);
        alert('Failed to delete investment. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Portfolio
            </h1>
            <p className="text-slate-600">Track your investments and portfolio performance</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Investment
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Savings Budget Status */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Savings Budget</h3>
              <p className="text-sm text-slate-500">Available for investment</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Available</span>
              <span className={`font-semibold ${(userData?.savingsAmount || 0) - portfolioMetrics.totalInvested >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{((userData?.savingsAmount || 0) - portfolioMetrics.totalInvested).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Invested</span>
              <span className="font-semibold text-slate-800">₹{portfolioMetrics.totalInvested.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Total Value</h3>
              <p className="text-sm text-slate-500">Current portfolio</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">₹{portfolioMetrics.totalValue.toLocaleString()}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Total Invested</h3>
              <p className="text-sm text-slate-500">Initial investment</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">₹{portfolioMetrics.totalInvested.toLocaleString()}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${portfolioMetrics.totalGainLoss >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'} rounded-xl flex items-center justify-center`}>
              {portfolioMetrics.totalGainLoss >= 0 ? <TrendingUp size={24} className="text-white" /> : <TrendingDown size={24} className="text-white" />}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Total P&L</h3>
              <p className="text-sm text-slate-500">Gain/Loss</p>
            </div>
          </div>
          <p className={`text-2xl font-bold ${portfolioMetrics.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{portfolioMetrics.totalGainLoss.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${portfolioMetrics.totalGainLossPercentage >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'} rounded-xl flex items-center justify-center`}>
              <BarChart size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Returns</h3>
              <p className="text-sm text-slate-500">Percentage</p>
            </div>
          </div>
          <p className={`text-2xl font-bold ${portfolioMetrics.totalGainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolioMetrics.totalGainLossPercentage >= 0 ? '+' : ''}{portfolioMetrics.totalGainLossPercentage.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Add Investment Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Investment Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Apple Inc., HDFC Bank"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="stocks">Stocks</option>
                  <option value="mutualfunds">Mutual Funds</option>
                  <option value="bonds">Bonds</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="gold">Gold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Symbol (Optional)</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                  placeholder="e.g., AAPL, MSFT"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="Number of shares/units"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Buy Price (₹)</label>
                <input
                  type="number"
                  value={formData.buyPrice}
                  onChange={(e) => setFormData({...formData, buyPrice: e.target.value})}
                  placeholder="Price per share/unit"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Price (₹)</label>
                <input
                  type="number"
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({...formData, currentPrice: e.target.value})}
                  placeholder="Current market price"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Purchase Date</label>
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
                {editingInvestment ? 'Update Investment' : 'Add Investment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingInvestment(null);
                  setFormData({
                    name: '',
                    type: 'stocks',
                    symbol: '',
                    quantity: '',
                    buyPrice: '',
                    currentPrice: '',
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

      {/* Investments List */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800">Your Investments</h3>
          <p className="text-slate-600 text-sm">{Array.isArray(investments) ? investments.length : 0} investments • Total value: ₹{portfolioMetrics.totalValue.toLocaleString()}</p>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading portfolio...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchPortfolio}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !Array.isArray(investments) || investments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={24} className="text-white" />
            </div>
            <p className="text-slate-600">No investments recorded yet</p>
            <p className="text-sm text-slate-500 mt-1">Start building your portfolio by adding your first investment</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {portfolioMetrics.updatedInvestments.map((investment) => (
              <div key={investment._id || investment.id} className="p-4 hover:bg-slate-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {investment.symbol || (investment.companyName || investment.name || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{investment.companyName || investment.name}</h4>
                      <p className="text-sm text-slate-500">
                        {investment.quantity} shares • Bought at ₹{investment.averageBuyPrice || investment.buyPrice}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">₹{investment.currentValue.toLocaleString()}</p>
                    <div className={`text-sm ${investment.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {investment.gainLoss >= 0 ? '+' : ''}₹{investment.gainLoss.toLocaleString()} ({investment.gainLossPercentage.toFixed(2)}%)
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(investment)}
                        className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(investment._id || investment.id)}
                        className="p-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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

export default PortfolioTab;
