import React, { useState } from 'react';
import { Settings, User, DollarSign, Calculator, RefreshCw, Download, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SettingsTab = ({ userData, onResetWizard }) => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const handleExportData = () => {
    setIsLoading(true);
    try {
      const exportData = {
        expenses: JSON.parse(localStorage.getItem('trackMint_expenses') || '[]'),
        investments: JSON.parse(localStorage.getItem('trackMint_investments') || '[]'),
        goals: JSON.parse(localStorage.getItem('trackMint_goals') || '[]'),
        userData: userData,
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `trackmint-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Data exported successfully!');
    } catch (error) {
      alert('Error exporting data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        if (confirm('This will replace all your current data. Are you sure you want to continue?')) {
          if (importData.expenses) {
            localStorage.setItem('trackMint_expenses', JSON.stringify(importData.expenses));
          }
          if (importData.investments) {
            localStorage.setItem('trackMint_investments', JSON.stringify(importData.investments));
          }
          if (importData.goals) {
            localStorage.setItem('trackMint_goals', JSON.stringify(importData.goals));
          }
          
          alert('Data imported successfully! Please refresh the page to see changes.');
          window.location.reload();
        }
      } catch (error) {
        alert('Invalid file format. Please select a valid TrackMint backup file.');
      } finally {
        setIsLoading(false);
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (confirm('This will permanently delete all your expenses, investments, and goals. This action cannot be undone. Are you sure?')) {
      if (confirm('Last warning: This will delete ALL your data. Continue?')) {
        localStorage.removeItem('trackMint_expenses');
        localStorage.removeItem('trackMint_investments');
        localStorage.removeItem('trackMint_goals');
        alert('All data cleared successfully!');
        window.location.reload();
      }
    }
  };

  const calculateDataStats = () => {
    const expenses = JSON.parse(localStorage.getItem('trackMint_expenses') || '[]');
    const investments = JSON.parse(localStorage.getItem('trackMint_investments') || '[]');
    const goals = JSON.parse(localStorage.getItem('trackMint_goals') || '[]');
    
    return {
      expenses: expenses.length,
      investments: investments.length,
      goals: goals.length,
      totalRecords: expenses.length + investments.length + goals.length
    };
  };

  const dataStats = calculateDataStats();

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'data', label: 'Data Management', icon: Download },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-slate-600">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold text-slate-800 mb-3">Settings</h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl">
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <User size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Account Details</h3>
                        <p className="text-sm text-slate-500">Your account information</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <p className="text-slate-600">{user?.email || 'Not available'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Member Since</label>
                        <p className="text-slate-600">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <DollarSign size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Financial Profile</h3>
                        <p className="text-sm text-slate-500">Your setup details</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Income</label>
                        <p className="text-slate-600">₹{userData?.income?.monthly?.toLocaleString() || '0'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Budget Rule</label>
                        <p className="text-slate-600">{userData?.budgetRule || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Risk Appetite</label>
                        <p className="text-slate-600 capitalize">{userData?.riskAppetite || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <RefreshCw size={20} className="text-orange-600" />
                    <h3 className="font-semibold text-orange-800">Reset Setup</h3>
                  </div>
                  <p className="text-sm text-orange-700 mb-4">
                    Reset your financial wizard setup and reconfigure your profile from scratch.
                  </p>
                  <button
                    onClick={onResetWizard}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                  >
                    Reset Wizard
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800">Data Management</h2>
                
                {/* Data Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{dataStats.expenses}</div>
                    <div className="text-sm text-blue-700">Expenses</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{dataStats.investments}</div>
                    <div className="text-sm text-green-700">Investments</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{dataStats.goals}</div>
                    <div className="text-sm text-purple-700">Goals</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-slate-600">{dataStats.totalRecords}</div>
                    <div className="text-sm text-slate-700">Total Records</div>
                  </div>
                </div>

                {/* Export Data */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Download size={20} className="text-green-600" />
                    <h3 className="font-semibold text-green-800">Export Data</h3>
                  </div>
                  <p className="text-sm text-green-700 mb-4">
                    Download a backup of all your financial data including expenses, investments, and goals.
                  </p>
                  <button
                    onClick={handleExportData}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Exporting...' : 'Export Data'}
                  </button>
                </div>

                {/* Import Data */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Upload size={20} className="text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Import Data</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    Restore your data from a previously exported backup file.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                    id="import-file"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="import-file"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer inline-block"
                  >
                    {isLoading ? 'Importing...' : 'Choose File'}
                  </label>
                </div>

                {/* Clear Data */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Trash2 size={20} className="text-red-600" />
                    <h3 className="font-semibold text-red-800">Clear All Data</h3>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    Permanently delete all your expenses, investments, and goals. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleClearAllData}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800">Preferences</h2>
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Application Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Currency</label>
                        <p className="text-xs text-slate-500">Display currency for all amounts</p>
                      </div>
                      <select className="border border-slate-200 rounded-lg px-3 py-2">
                        <option value="INR">₹ Indian Rupee</option>
                        <option value="USD">$ US Dollar</option>
                        <option value="EUR">€ Euro</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Number Format</label>
                        <p className="text-xs text-slate-500">How numbers are displayed</p>
                      </div>
                      <select className="border border-slate-200 rounded-lg px-3 py-2">
                        <option value="indian">Indian (1,00,000)</option>
                        <option value="international">International (100,000)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Privacy & Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Data Storage</label>
                        <p className="text-xs text-slate-500">Your data is stored locally in your browser</p>
                      </div>
                      <span className="text-green-600 text-sm font-medium">Secure</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Analytics</label>
                        <p className="text-xs text-slate-500">Help improve TrackMint</p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
