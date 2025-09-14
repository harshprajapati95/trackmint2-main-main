import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Target, 
  Settings,
  LogOut,
  User,
  MessageCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeTab, onTabChange, userData }) => {
  const { user } = useAuth();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'recommendations', label: 'Recommendations', icon: BarChart3 },
    { id: 'chat', label: 'AI Advisor', icon: MessageCircle },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-xl flex flex-col border-r border-slate-200/60 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              TrackMint
            </h1>
            <p className="text-xs text-slate-500">Personal Finance</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 md:p-6 border-b border-slate-200/60 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center gap-3 p-3 md:p-4 bg-white/60 rounded-xl shadow-sm border border-white/40 backdrop-blur-sm hover:bg-white/70 transition-all duration-200">
          <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <User size={18} className="text-white md:w-5 md:h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800 text-sm">
              {user?.email?.split('@')[0] || 'Welcome back!'}
            </p>
            <p className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full inline-block mt-1 font-medium">
              ₹{userData?.income?.monthly?.toLocaleString() || '0'}/month
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 md:p-6 space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
          Navigation
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02] border border-blue-400/20'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 hover:shadow-md hover:transform hover:scale-[1.01] hover:border-slate-200/60 border border-transparent'
                  }`}
                >
                  {/* Background gradient effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  
                  <div className={`relative p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 shadow-sm' 
                      : 'bg-slate-100/80 group-hover:bg-white group-hover:shadow-sm'
                  }`}>
                    <Icon size={18} className={`transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-slate-600 group-hover:text-blue-600'
                    }`} />
                  </div>
                  <span className={`relative font-medium transition-all duration-300 ${
                    isActive ? 'text-white' : 'group-hover:text-slate-800'
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="relative ml-auto w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                  )}
                  
                  {/* Special indicator for AI Advisor */}
                  {item.id === 'chat' && !isActive && (
                    <div className="relative ml-auto">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-30"></div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 md:p-6 border-t border-slate-200/60 bg-white/20 backdrop-blur-sm">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
          Account
        </div>
        <ul className="space-y-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                    item.id === 'logout'
                      ? 'text-red-500 hover:bg-red-50/80 hover:text-red-600 hover:shadow-md border border-transparent hover:border-red-200/60'
                      : isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/20'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-800 hover:shadow-md border border-transparent hover:border-slate-200/60'
                  }`}
                >
                  {/* Background gradient effect */}
                  {!isActive && item.id !== 'logout' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  
                  <div className={`relative p-2 rounded-lg transition-all duration-300 ${
                    item.id === 'logout'
                      ? 'bg-red-100/80 group-hover:bg-red-200/80'
                      : isActive 
                      ? 'bg-white/20 shadow-sm' 
                      : 'bg-slate-100/80 group-hover:bg-white group-hover:shadow-sm'
                  }`}>
                    <Icon size={18} className={`transition-all duration-300 ${
                      item.id === 'logout' 
                        ? 'text-red-500' 
                        : isActive 
                        ? 'text-white' 
                        : 'text-slate-600 group-hover:text-blue-600'
                    }`} />
                  </div>
                  <span className={`relative font-medium transition-all duration-300 ${
                    item.id === 'logout'
                      ? 'text-red-500 group-hover:text-red-600'
                      : isActive 
                      ? 'text-white' 
                      : 'group-hover:text-slate-800'
                  }`}>
                    {item.label}
                  </span>
                  {isActive && item.id !== 'logout' && (
                    <div className="relative ml-auto w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
