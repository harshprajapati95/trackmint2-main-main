import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import LandingPage from '../LandingPage';

const AuthContainer = () => {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'signup'

  const showLanding = () => setCurrentView('landing');
  const showLogin = () => setCurrentView('login');
  const showSignup = () => setCurrentView('signup');

  return (
    <div className="auth-container">
      {currentView === 'landing' && (
        <LandingPage onLogin={showLogin} onSignup={showSignup} />
      )}
      {currentView === 'login' && (
        <Login onSwitchToSignup={showSignup} onBackToLanding={showLanding} />
      )}
      {currentView === 'signup' && (
        <Signup onSwitchToLogin={showLogin} onBackToLanding={showLanding} />
      )}
    </div>
  );
};

export default AuthContainer;
