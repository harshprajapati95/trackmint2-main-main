import React, { useState } from 'react';
import { Shield, TrendingUp, Zap, BarChart3, CheckCircle } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';

const RiskAppetiteSelection = () => {
  const { userData, dispatch, actions } = useWizard();
  const [selectedRisk, setSelectedRisk] = useState(userData.riskAppetite);

  const handleRiskChange = (risk) => {
    setSelectedRisk(risk);
    dispatch({ type: actions.UPDATE_RISK_APPETITE, payload: risk });
  };

  const riskProfiles = [
    {
      id: 'Conservative',
      title: 'Conservative',
      subtitle: 'Safety First',
      description: 'You prefer stable returns with minimal risk of losing your principal investment',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      characteristics: [
        'Low risk tolerance',
        'Stable, predictable returns',
        'Capital preservation focus',
        'Short to medium investment horizon'
      ],
      expectedReturn: '6-8%',
      riskLevel: 'Low',
      suitableFor: 'Near retirement, risk-averse investors',
      investments: ['Fixed Deposits', 'Government Bonds', 'Conservative Mutual Funds', 'Blue-chip Stocks'],
    },
    {
      id: 'Balanced',
      title: 'Balanced',
      subtitle: 'Moderate Growth',
      description: 'You seek a balance between growth and stability, willing to accept moderate risk',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      characteristics: [
        'Moderate risk tolerance',
        'Balanced growth and stability',
        'Diversified portfolio',
        'Medium to long investment horizon'
      ],
      expectedReturn: '8-12%',
      riskLevel: 'Medium',
      suitableFor: 'Working professionals, balanced approach',
      investments: ['Hybrid Mutual Funds', 'Large-cap Stocks', 'Balanced ETFs', 'Corporate Bonds'],
      recommended: true,
    },
    {
      id: 'Aggressive',
      title: 'Aggressive',
      subtitle: 'High Growth',
      description: 'You are comfortable with high risk for potentially higher returns over the long term',
      icon: Zap,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      characteristics: [
        'High risk tolerance',
        'Growth-focused strategy',
        'Can handle volatility',
        'Long investment horizon'
      ],
      expectedReturn: '12-16%',
      riskLevel: 'High',
      suitableFor: 'Young investors, high-income earners',
      investments: ['Small-cap Stocks', 'Growth Mutual Funds', 'Sector ETFs', 'Emerging Markets'],
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <BarChart3 size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your risk appetite?</h2>
        <p className="text-gray-600 text-lg">Choose your investment risk level to get personalized recommendations</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {riskProfiles.map((profile) => {
            const Icon = profile.icon;
            const isSelected = selectedRisk === profile.id;
            
            return (
              <div
                key={profile.id}
                className={`relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 border-2 ${
                  isSelected 
                    ? 'border-emerald-500 shadow-xl transform scale-105' 
                    : 'border-gray-200 hover:border-emerald-300 hover:shadow-xl'
                }`}
                onClick={() => handleRiskChange(profile.id)}
              >
                {profile.recommended && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Recommended
                  </div>
                )}
                
                {isSelected && (
                  <div className="absolute -top-3 -left-3 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle size={20} />
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${
                    isSelected ? 'bg-emerald-500 text-white' : `${profile.bgColor} ${profile.color}`
                  }`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{profile.title}</h3>
                  <p className="text-sm text-emerald-600 font-medium">{profile.subtitle}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{profile.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Expected Return</p>
                      <p className="font-bold text-emerald-600">{profile.expectedReturn}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Risk Level</p>
                      <p className={`font-bold ${
                        profile.riskLevel === 'Low' ? 'text-blue-600' :
                        profile.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {profile.riskLevel}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Key Characteristics:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {profile.characteristics.map((char, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Suitable Investment Types:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.investments.slice(0, 3).map((investment, index) => (
                        <span key={index} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          {investment}
                        </span>
                      ))}
                      {profile.investments.length > 3 && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          +{profile.investments.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Best for:</span> {profile.suitableFor}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedRisk && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-6 text-center text-xl">
              Your Selected Risk Profile: {selectedRisk}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Time Horizon</h4>
                <p className="text-sm text-gray-600">
                  {selectedRisk === 'Conservative' ? '1-3 years' :
                   selectedRisk === 'Balanced' ? '3-7 years' : '7+ years'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Max Drawdown</h4>
                <p className="text-sm text-gray-600">
                  {selectedRisk === 'Conservative' ? '5-10%' :
                   selectedRisk === 'Balanced' ? '10-20%' : '20-30%'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Volatility</h4>
                <p className="text-sm text-gray-600">
                  {selectedRisk === 'Conservative' ? 'Low' :
                   selectedRisk === 'Balanced' ? 'Moderate' : 'High'}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-700 text-center">
                💡 Based on your selection, we'll recommend a portfolio that matches your risk tolerance and financial goals.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            💡 Remember, higher returns typically come with higher risk. Choose what aligns with your comfort level and goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAppetiteSelection;
