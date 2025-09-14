# TrackMint 2.0 - Personal Finance Dashboard

A modern, responsive personal finance management application built with React, Vite, and Tailwind CSS. TrackMint helps users manage their finances through budgeting, expense tracking, investment planning, and AI-powered financial advice.

## 🚀 Features

- **User Authentication**: Secure login/signup with Supabase
- **Financial Wizard**: Step-by-step onboarding for budget planning
- **Dashboard Overview**: Comprehensive financial dashboard with charts and analytics
- **Expense Tracking**: Categorized expense management with budget allocation
- **Investment Portfolio**: Track stocks and investments with real-time data
- **Goal Setting**: Set and track financial goals
- **AI Financial Advisor**: Get personalized advice using Gemini AI
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1, Vite 7.1.2
- **Styling**: Tailwind CSS 3.4.17
- **Authentication**: Supabase
- **Charts**: Recharts 3.1.2
- **Icons**: Lucide React 0.468.0
- **APIs**: Finnhub (stock data), Google Gemini AI
- **Deployment**: Render with Express.js server

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trackmint2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_FINNHUB_API_KEY=your_finnhub_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Start development server:
```bash
npm run dev
```

## 🚀 Deployment

### Local Build
```bash
npm run build
npm start
```

### Render Deployment
1. Connect your repository to Render
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard

## 📱 Screenshots

### Dashboard
- Modern, clean interface with financial overview
- Interactive charts and progress indicators
- Responsive design for all screen sizes

### Features
- **Budget Planning**: 50-30-20 rule or custom budget allocation
- **Expense Tracking**: Categorized expenses with visual feedback
- **Investment Tracking**: Real-time stock data and portfolio management
- **AI Advisor**: Personalized financial advice chat interface

## 🔧 Configuration

### API Setup
1. **Supabase**: Set up authentication and database
2. **Finnhub**: Get API key for stock market data
3. **Gemini AI**: Configure for financial advisory features

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase anonymous key
- `VITE_FINNHUB_API_KEY`: Finnhub API key for stock data
- `VITE_GEMINI_API_KEY`: Google Gemini AI API key

## 📊 Features Overview

### Dashboard Components
- **Overview**: Financial summary with key metrics
- **Expenses**: Track and categorize spending
- **Portfolio**: Investment tracking and analysis
- **Goals**: Set and monitor financial objectives
- **AI Advisor**: Chat with AI for financial guidance
- **Settings**: Profile and data management

### Wizard Setup
- **Income Entry**: Set monthly/annual income
- **Budget Rules**: Choose or customize budget allocation
- **Expense Planning**: Add expected monthly expenses
- **Risk Assessment**: Determine investment risk tolerance
- **Recommendations**: Get personalized investment suggestions

## 🎨 Design System

Built with Tailwind CSS featuring:
- Consistent color palette with emerald/teal gradients
- Responsive breakpoints for all devices
- Smooth animations and transitions
- Accessible design patterns
- Modern card-based layouts

## 🔒 Security

- Secure authentication with Supabase
- Environment variable protection
- Input validation and sanitization
- Error boundary implementation

## 📈 Performance

- Vite for fast development and builds
- Code splitting and lazy loading
- Optimized images and assets
- Efficient state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**TrackMint 2.0** - Empowering better financial decisions through technology.
