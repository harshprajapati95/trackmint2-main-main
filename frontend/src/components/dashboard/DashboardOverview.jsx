import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Target, ArrowUp, ArrowDown, Wallet, Receipt } from 'lucide-react';
import { calculateBudgetAllocation } from '../../context/WizardContext';
import { colors } from '../../constants/theme';

const DashboardOverview = ({ userData, onTabChange }) => {
  const budgetAllocation = calculateBudgetAllocation(
    userData.income,
    userData.budgetRule,
    userData.customBudget
  );

  // Calculate dynamic values based on user data
  const monthlyIncome = userData.income?.monthly || 50000;
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  
  // Calculate realistic expenses based on user's budget allocation
  const calculateExpenses = () => {
    const needsAmount = budgetAllocation.needs;
    const wantsAmount = budgetAllocation.wants;
    const savingsAmount = budgetAllocation.savings;
    
    // Add some realistic variation (±10%)
    const variation = () => 0.9 + (Math.random() * 0.2);
    
    return {
      needs: Math.round(needsAmount * variation()),
      wants: Math.round(wantsAmount * variation()),
      savings: Math.round(savingsAmount * variation())
    };
  };

  const currentExpenses = calculateExpenses();
  
  // Calculate portfolio value based on savings and some growth
  const monthsSinceStart = Math.max(1, currentMonthIndex + 1);
  const totalSavings = budgetAllocation.savings * monthsSinceStart;
  const portfolioGrowth = 0.08; // 8% annual growth
  const portfolioValue = Math.round(totalSavings * (1 + (portfolioGrowth * monthsSinceStart / 12)));
  
  // Mock data for charts with more realistic values
  const monthlyExpenses = [
    { month: 'Jan', needs: budgetAllocation.needs * 0.95, wants: budgetAllocation.wants * 1.1, savings: budgetAllocation.savings * 1.0 },
    { month: 'Feb', needs: budgetAllocation.needs * 0.92, wants: budgetAllocation.wants * 1.05, savings: budgetAllocation.savings * 1.0 },
    { month: 'Mar', needs: budgetAllocation.needs * 1.04, wants: budgetAllocation.wants * 0.85, savings: budgetAllocation.savings * 1.0 },
    { month: 'Apr', needs: budgetAllocation.needs * 0.96, wants: budgetAllocation.wants * 0.95, savings: budgetAllocation.savings * 1.0 },
    { month: 'May', needs: budgetAllocation.needs * 0.88, wants: budgetAllocation.wants * 1.15, savings: budgetAllocation.savings * 1.0 },
    { month: 'Jun', needs: currentExpenses.needs, wants: currentExpenses.wants, savings: currentExpenses.savings },
  ];

  const portfolioHistory = [
    { month: 'Jan', value: totalSavings * 0.2 * 1.00 },
    { month: 'Feb', value: totalSavings * 0.4 * 1.02 },
    { month: 'Mar', value: totalSavings * 0.6 * 0.98 },
    { month: 'Apr', value: totalSavings * 0.8 * 1.05 },
    { month: 'May', value: totalSavings * 0.9 * 1.07 },
    { month: 'Jun', value: portfolioValue },
  ];

  const budgetBreakdown = [
    { name: 'Needs', value: budgetAllocation.needs, color: colors.primary },
    { name: 'Wants', value: budgetAllocation.wants, color: colors.accent },
    { name: 'Savings', value: budgetAllocation.savings, color: colors.success },
  ];

  // Calculate current month totals using dynamic data
  const currentMonth = monthlyExpenses[monthlyExpenses.length - 1];
  const currentPortfolio = portfolioHistory[portfolioHistory.length - 1];
  const previousPortfolio = portfolioHistory[portfolioHistory.length - 2];
  const portfolioChange = ((currentPortfolio.value - previousPortfolio.value) / previousPortfolio.value * 100);

  const totalExpenses = currentMonth.needs + currentMonth.wants;
  const budgetUtilization = (totalExpenses / (budgetAllocation.needs + budgetAllocation.wants)) * 100;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-accent">₹{data.value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 md:mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base lg:text-lg">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="text-center md:text-right bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 shadow-lg">
          <p className="text-xs md:text-sm text-slate-500">Last updated</p>
          <p className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg md:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-slate-500 mb-1">Monthly Income</p>
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-slate-800">
                ₹{userData.income.monthly?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign size={16} className="text-white sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg md:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-slate-500 mb-1">Total Expenses</p>
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-slate-800">₹{totalExpenses.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1 md:mt-2">
                <span className={`text-xs px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${budgetUtilization > 100 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {budgetUtilization.toFixed(1)}% of budget
                </span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <Wallet size={16} className="text-white sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg md:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-slate-500 mb-1">Portfolio Value</p>
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-slate-800">₹{currentPortfolio.value.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                {portfolioChange >= 0 ? (
                  <ArrowUp size={12} className="text-emerald-600" />
                ) : (
                  <ArrowDown size={12} className="text-red-600" />
                )}
                <span className={`text-xs ${portfolioChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {Math.abs(portfolioChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp size={16} className="text-white sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg md:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-slate-500 mb-1">Monthly Savings</p>
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-slate-800">₹{currentMonth.savings.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                <span className="text-xs text-emerald-600">
                  {((currentMonth.savings / userData.income.monthly) * 100).toFixed(1)}% of income
                </span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <Target size={16} className="text-white sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Summary Widget */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-0.5 sm:mb-1">📊 Investment Recommendations</h3>
            <p className="text-xs sm:text-sm text-slate-600">Based on your {userData?.riskAppetite?.toLowerCase() || 'balanced'} risk profile</p>
          </div>
          <button 
            onClick={() => onTabChange?.('recommendations')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 mt-1 sm:mt-0"
          >
            View All →
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Stocks */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg md:rounded-xl p-3 sm:p-4 border border-white/40">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="font-semibold text-slate-800 text-sm sm:text-base">Top Stocks</span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-600">AAPL</span>
                <span className="text-green-600 font-medium">+1.45%</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-600">MSFT</span>
                <span className="text-red-600 font-medium">-0.35%</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-600">GOOGL</span>
                <span className="text-green-600 font-medium">+2.73%</span>
              </div>
            </div>
          </div>

          {/* Mutual Funds */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-green-600" />
              <span className="font-semibold text-slate-800">Mutual Funds</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">HDFC Flexi Cap</span>
                <span className="text-blue-600 font-medium">10-12%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Parag Parikh</span>
                <span className="text-blue-600 font-medium">11-13%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">SBI Small Cap</span>
                <span className="text-blue-600 font-medium">12-15%</span>
              </div>
            </div>
          </div>

          {/* Budget Allocation */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
            <div className="flex items-center gap-2 mb-3">
              <Receipt size={18} className="text-purple-600" />
              <span className="font-semibold text-slate-800">Budget Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Needs</span>
                <span className="text-slate-800 font-medium">₹{budgetAllocation.needs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Wants</span>
                <span className="text-slate-800 font-medium">₹{budgetAllocation.wants.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Savings</span>
                <span className="text-green-600 font-medium">₹{budgetAllocation.savings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Expenses Chart */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 shadow-xl">
          <h3 className="font-semibold text-slate-800 mb-2 sm:mb-4 text-sm sm:text-base">Monthly Expenses Trend</h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8ED" />
                <XAxis dataKey="month" tick={{fontSize: 10}} />
                <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} tick={{fontSize: 10}} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="needs" fill={colors.primary} radius={[2, 2, 0, 0]} />
                <Bar dataKey="wants" fill={colors.accent} radius={[2, 2, 0, 0]} />
                <Bar dataKey="savings" fill={colors.success} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-6 mt-2 sm:mt-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <span>Needs</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: colors.accent }}></div>
              <span>Wants</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: colors.success }}></div>
              <span>Savings</span>
            </div>
          </div>
        </div>

        {/* Portfolio Growth Chart */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 shadow-xl">
          <h3 className="font-semibold text-slate-800 mb-2 sm:mb-4 text-sm sm:text-base">Portfolio Growth</h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8ED" />
                <XAxis dataKey="month" tick={{fontSize: 10}} />
                <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} tick={{fontSize: 10}} />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
                  labelStyle={{ color: colors.textPrimary }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors.accent} 
                  strokeWidth={2}
                  dot={{ fill: colors.accent, strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: colors.accent }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Budget Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
        {/* Budget Allocation Pie Chart */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 shadow-xl">
          <h3 className="font-semibold text-slate-800 mb-2 sm:mb-4 text-sm sm:text-base">Budget Allocation</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="h-40 sm:h-48 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {budgetBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 w-full sm:w-1/2">
              {budgetBreakdown.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
