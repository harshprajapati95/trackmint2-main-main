import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import ExpensesTab from './ExpensesTab';
import PortfolioTab from './PortfolioTab';
import GoalsTab from './GoalsTab';
import SettingsTab from './SettingsTab';
import AIAdviser from './AIAdviser';
import RecommendationsDashboard from './RecommendationsDashboard';

// Enhanced Chat Tab with AI Adviser
const ChatTab = ({ userData }) => (
  <div className="space-y-4 md:space-y-6">
    <div className="mb-4 md:mb-6">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        AI Financial Advisor
      </h1>
      <p className="text-sm md:text-base text-slate-600">Get personalized financial advice powered by Gemini AI</p>
    </div>
    <div className="h-[calc(100vh-200px)] md:h-[700px]">
      <AIAdviser userData={userData} />
    </div>
  </div>
);

// Recommendations Tab
const RecommendationsTab = ({ userData }) => (
  <div className="space-y-4 md:space-y-6">
    <div className="mb-4 md:mb-6">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Investment Recommendations
      </h1>
      <p className="text-sm md:text-base text-slate-600">Personalized investment suggestions based on your financial profile</p>
    </div>
    <RecommendationsDashboard userData={userData} />
  </div>
);

const Dashboard = ({ userData, onResetWizard, onLogout, instruments }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab) => {
    if (tab === 'logout') {
      onLogout?.();
      return;
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview userData={userData} onTabChange={handleTabChange} />;
      case 'expenses':
        return <ExpensesTab userData={userData} />;
      case 'portfolio':
        return <PortfolioTab userData={userData} />;
      case 'goals':
        return <GoalsTab userData={userData} />;
      case 'recommendations':
        return <RecommendationsTab userData={userData} />;
      case 'chat':
        return <ChatTab userData={userData} />;
      case 'settings':
        return <SettingsTab userData={userData} onResetWizard={onResetWizard} />;
      default:
        return <DashboardOverview userData={userData} onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Sidebar - Always visible */}
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          userData={userData}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full p-3 md:p-6 lg:p-8 pb-6 md:pb-6 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default Dashboard;
