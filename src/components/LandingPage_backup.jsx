import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  PieChart, 
  Shield, 
  Zap, 
  Brain,
  ChevronRight,
  Star,
  Users,
  DollarSign,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Globe,
  Lock,
  Smartphone,
  Menu,
  X
} from 'lucide-react';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Smart Portfolio Tracking",
      description: "Monitor your investments with real-time data and intelligent insights that help you make informed decisions."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal-Based Planning",
      description: "Set and track financial goals with personalized strategies that adapt to your progress and circumstances."
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Expense Analytics",
      description: "Understand your spending patterns with detailed analytics and automated categorization."
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Financial Advisor",
      description: "Get personalized recommendations powered by advanced AI that learns from your financial behavior."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bank-Level Security",
      description: "Your financial data is protected with enterprise-grade encryption and security protocols."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-Time Insights",
      description: "Stay informed with instant notifications and live updates on your financial health."
    }
  ];

  const benefits = [
    "Track investments across multiple portfolios",
    "Set and monitor financial goals",
    "Automated expense categorization",
    "AI-powered financial recommendations",
    "Real-time market data integration",
    "Comprehensive financial reporting"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/80 border-b border-emerald-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                TrackMint
              </span>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={onLogin}
                className="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-emerald-50"
              >
                Sign In
              </button>
              <button
                onClick={onSignup}
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">Get Started</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-gray-700 hover:text-emerald-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-md">
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={() => {
                    onLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300 font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onSignup();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-lg font-medium shadow-lg transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Classical Design */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>Revolutionary Finance Platform</span>
          </div>
          
          {/* Main heading - more visible and classical */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-gray-900 mb-2">
              Master Your
            </span>
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Financial Future
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience the future of personal finance with AI-powered insights, 
            <span className="text-emerald-600 font-semibold"> real-time analytics</span>, and 
            <span className="text-teal-600 font-semibold"> intelligent automation</span>.
          </p>

          {/* CTA buttons - classical design */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={onSignup}
              className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <button
              onClick={onLogin}
              className="group border-2 border-emerald-600 text-emerald-600 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center gap-3"
            >
              <span>Sign In</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Stats cards - simplified */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { value: "99.9%", label: "Accuracy", icon: <Target className="h-6 w-6" /> },
              { value: "24/7", label: "Support", icon: <Shield className="h-6 w-6" /> },
              { value: "Real-time", label: "Updates", icon: <Zap className="h-6 w-6" /> },
              { value: "AI-Powered", label: "Insights", icon: <Brain className="h-6 w-6" /> }
            ].map((stat, index) => (
              <div key={index} className="group p-6 bg-white/70 backdrop-blur-sm border border-emerald-100 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="text-center">
                  <div className="text-emerald-600 mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-bl from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Revolutionary Features
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Everything you need to
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
                dominate your finances
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of personal finance with cutting-edge technology and intuitive design.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Card container with advanced effects */}
                <div className="relative h-full p-8 bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-3xl hover:bg-white transition-all duration-700 transform hover:-translate-y-4 hover:rotate-1 shadow-lg hover:shadow-2xl">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 -m-0.5 -z-10 blur-sm"></div>

                  <div className="relative z-10">
                    {/* Icon with premium styling */}
                    <div className="relative mb-6">
                      <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl group-hover:shadow-emerald-500/25 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        {React.cloneElement(feature.icon, { 
                          className: "h-8 w-8 text-white relative z-10" 
                        })}
                      </div>
                      {/* Floating particles around icon */}
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500"></div>
                      <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700"></div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-500 mb-6">
                      {feature.description}
                    </p>

                    {/* Premium CTA link */}
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 cursor-pointer">
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Premium showcase grid */}
          <div className="mt-24 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Interactive preview */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl">
                {/* Mock dashboard */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Portfolio Overview</h4>
                      <p className="text-gray-400 text-sm">Real-time tracking</p>
                    </div>
                  </div>
                  
                  {/* Mock charts */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4">
                        <div className="h-16 bg-gradient-to-t from-emerald-500/30 to-teal-500/30 rounded mb-2"></div>
                        <div className="text-white text-sm font-medium">+{12 + i}%</div>
                      </div>
                    ))}
                  </div>

                  {/* Mock list */}
                  <div className="space-y-3">
                    {['AAPL', 'GOOGL', 'TSLA'].map((stock, i) => (
                      <div key={stock} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-white font-medium">{stock}</span>
                        <span className="text-emerald-400">+{2 + i}.{3}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-teal-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Right side - Benefits */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                Why choose <span className="text-emerald-600">TrackMint</span>?
              </h3>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-emerald-50 transition-all duration-500 transform hover:translate-x-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-emerald-700 transition-colors duration-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={onSignup}
                  className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 flex items-center gap-3"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Classical Design */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-600 to-teal-700 overflow-hidden">
        {/* Elegant background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Elegant badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span>Ready to Transform?</span>
          </div>

          {/* Main CTA heading - clear and visible */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Your Financial
            <br />
            <span className="text-emerald-200">Revolution Starts Now</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-emerald-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join thousands of users who've already transformed their financial lives. 
            <span className="text-white font-semibold"> Start your journey today.</span>
          </p>

          {/* Classical CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            {/* Primary CTA */}
            <button
              onClick={onSignup}
              className="group bg-white text-emerald-600 px-12 py-5 rounded-xl font-bold text-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-4"
            >
              <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Start Free Trial</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            {/* Secondary CTA */}
            <button
              onClick={onLogin}
              className="group border-2 border-white text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-white hover:text-emerald-600 transition-all duration-300 flex items-center gap-3"
            >
              <span>Sign In</span>
              <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-emerald-100">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span className="text-sm">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm">Setup in 2 Minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Why Choose <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">TrackMint</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of powerful features, intuitive design, and cutting-edge technology.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits section */}
          <div className="mt-20 p-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-8">Everything you need to succeed financially</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="w-2 h-2 bg-emerald-200 rounded-full flex-shrink-0"></div>
                    <span className="text-emerald-50 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-900 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          <div className="absolute top-10 left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  TrackMint
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Revolutionizing personal finance with AI-powered insights and intuitive design. 
                Your journey to financial freedom starts here.
              </p>
              
              {/* Social links */}
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'Discord'].map((social) => (
                  <div key={social} className="w-12 h-12 bg-gray-800 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer group">
                    <div className="w-6 h-6 bg-gray-400 group-hover:bg-white rounded transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links sections */}
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Security", "API", "Mobile App"]
              },
              {
                title: "Company", 
                links: ["About", "Careers", "Press", "Partners", "Contact"]
              },
              {
                title: "Resources",
                links: ["Blog", "Help Center", "Community", "Tutorials", "Status"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-white font-bold text-lg mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                        <span>{link}</span>
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center lg:text-left">
                © 2025 TrackMint. All rights reserved. Built  for financial freedom.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;