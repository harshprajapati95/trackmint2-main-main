import React from 'react';
import { AuthProvider, useAuth, ProtectedRoute } from './context/AuthContext';
import { WizardProvider, useWizard } from './context/WizardContext';
import { BudgetProvider } from './context/BudgetContext';
import AuthContainer from './components/auth/AuthContainer';
import FinanceWizard from './components/wizard/FinanceWizard';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

// Loading Component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          TrackMint
        </h2>
        <p className="text-slate-600">Loading your financial dashboard...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  // Show protected content if authenticated
  return (
    <ProtectedRoute>
      <WizardProvider userId={user?._id || user?.id}>
        <ProtectedAppContent />
      </WizardProvider>
    </ProtectedRoute>
  );
}

function ProtectedAppContent() {
  const { isComplete, userData, dispatch, actions } = useWizard();
  const { logout, updateProfile, user } = useAuth();

  const handleWizardComplete = async () => {
    try {
      // First, update the user profile with wizard data
      const profileData = {
        monthlyIncome: userData.income?.monthly || 0,
        budgetRule: userData.budgetRule || '50-30-20',
        riskAppetite: userData.riskAppetite?.toLowerCase() || 'moderate',
        profileComplete: true
      };

      // Include customBudget if the rule is custom
      if (userData.budgetRule === 'custom' && userData.customBudget) {
        profileData.customBudget = userData.customBudget;
      }

      await updateProfile(profileData);
      
      // Then mark wizard as complete
      dispatch({ type: actions.COMPLETE_WIZARD });
    } catch (error) {
      console.error('Failed to update profile after wizard completion:', error);
      // Still complete the wizard locally even if profile update fails
      dispatch({ type: actions.COMPLETE_WIZARD });
    }
  };

  const handleResetWizard = () => {
    if (confirm('This will reset all your setup data and you\'ll need to complete the wizard again. Continue?')) {
      dispatch({ type: actions.RESET_WIZARD });
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout();
    }
  };

  // Show wizard if setup not complete
  if (!isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <FinanceWizard onComplete={handleWizardComplete} />
      </div>
    );
  }

  // Create userData object from actual user profile for dashboard
  const dashboardUserData = {
    income: {
      monthly: user?.monthlyIncome || 0,
      annual: (user?.monthlyIncome || 0) * 12
    },
    budgetRule: user?.budgetRule || '50-30-20',
    customBudget: user?.customBudget || { needs: 50, wants: 30, savings: 20 },
    riskAppetite: user?.riskAppetite || 'moderate',
    profileComplete: user?.profileComplete || false
  };

  // Show dashboard if setup is complete
  return (
    <BudgetProvider userData={dashboardUserData}>
      <Dashboard
        userData={dashboardUserData}
        onResetWizard={handleResetWizard}
        onLogout={handleLogout}
      />
    </BudgetProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
