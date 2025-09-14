import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Target, Star, CheckCircle } from "lucide-react";
import { useWizard, generateRecommendations, calculateBudgetAllocation } from "../../context/WizardContext";

const Recommendations = () => {
  const { userData } = useWizard();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetAllocation, setBudgetAllocation] = useState(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // Check if we have the required data
        if (!userData?.income?.monthly && !userData?.income?.annual) {
          console.error("Income data not available:", userData);
          setLoading(false);
          return;
        }

        if (!userData?.riskAppetite) {
          console.error("Risk appetite not available:", userData);
          setLoading(false);
          return;
        }

        // ✅ Calculate budget allocation
        const allocation = calculateBudgetAllocation(
          userData.income, 
          userData.budgetRule, 
          userData.customBudget
        );
        setBudgetAllocation(allocation);

        // ✅ Generate stock recommendations
        const recs = await generateRecommendations(userData.riskAppetite, allocation);
        
        // Ensure we have valid recommendations
        if (recs && Array.isArray(recs.stocks)) {
          setRecommendations(recs.stocks);
        } else {
          // Fallback recommendations
          setRecommendations([
            { symbol: 'AAPL', description: 'Apple Inc.', currentPrice: 150.00, changePercent: 2.5 },
            { symbol: 'MSFT', description: 'Microsoft Corporation', currentPrice: 300.00, changePercent: 1.8 },
            { symbol: 'GOOGL', description: 'Alphabet Inc.', currentPrice: 2500.00, changePercent: -0.5 },
          ]);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [userData]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingUp size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Generating Your Recommendations</h2>
          <p className="text-gray-600 text-lg">Please wait while we create personalized investment suggestions for you</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-gray-200">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your financial profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingUp size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Investment Recommendations</h2>
          <p className="text-gray-600 text-lg">Personalized suggestions based on your financial profile</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-gray-200">
          <div className="text-center py-8">
            <Target size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No recommendations available</p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Debug info:</p>
              <p>Income: {userData?.income?.monthly || userData?.income?.annual || 'Not set'}</p>
              <p>Risk Appetite: {userData?.riskAppetite || 'Not set'}</p>
              <p>Budget Rule: {userData?.budgetRule || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Star size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Investment Recommendations</h2>
        <p className="text-gray-600 text-lg">Personalized suggestions based on your financial profile</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Budget Overview */}
        {budgetAllocation && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-xl">
              <DollarSign size={20} className="text-blue-600" />
              Monthly Budget Allocation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Needs</p>
                <p className="font-bold text-blue-600 text-2xl">₹{budgetAllocation.needs.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Wants</p>
                <p className="font-bold text-purple-600 text-2xl">₹{budgetAllocation.wants.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm">Savings/Investment</p>
                <p className="font-bold text-green-600 text-2xl">₹{budgetAllocation.savings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stock Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
            <TrendingUp size={20} className="text-emerald-600" />
            Recommended Stocks for Your Risk Profile
          </h3>
          
          <div className="grid gap-4">
            {recommendations.map((stock, index) => (
              <div
                key={stock.symbol || index}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{stock.symbol}</h4>
                    <p className="text-sm text-gray-600">{stock.description || 'Stock Investment'}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    ₹{(stock.currentPrice || 0).toFixed(2)}
                  </p>
                  <p className={`text-sm font-medium ${
                    (stock.changePercent || 0) > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(stock.changePercent || 0) > 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                  </p>
                </div>
                
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">Recommended</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Message */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-emerald-200 text-center">
          <CheckCircle size={48} className="text-emerald-600 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2 text-xl">Congratulations!</h3>
          <p className="text-gray-600 mb-4">
            You've completed your financial planning setup. These recommendations are tailored to your risk profile and budget.
          </p>
          <p className="text-sm text-emerald-700">
            💡 Remember to review and adjust your portfolio regularly based on market conditions and life changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
