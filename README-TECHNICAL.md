# TrackMint - Personal Finance Management System

## 🚀 Overview

TrackMint is a full-stack personal finance management application that helps users track expenses, manage budgets, create investment portfolios, and get AI-powered financial advice. Built with modern web technologies, it provides a seamless experience for financial planning and investment tracking.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (React/Vite)  │◄──►│   (Node.js)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • REST API      │    │ • MongoDB       │
│ • Wizard        │    │ • Auth System   │    │ • Finnhub API   │
│ • Portfolio     │    │ • Middleware    │    │ • Gemini AI     │
│ • AI Advisor    │    │ • Controllers   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts** - Responsive chart library
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting middleware

### External APIs
- **Finnhub API** - Real-time stock market data
- **Google Gemini AI** - AI-powered financial advice
- **MongoDB Atlas** - Cloud database hosting

## 📁 Project Structure

```
trackmint2-main-main/
├── frontend/                     # React frontend application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── dashboard/       # Dashboard related components
│   │   │   └── wizard/          # Setup wizard components
│   │   ├── context/             # React Context providers
│   │   ├── api/                 # API integration layer
│   │   ├── constants/           # App constants and themes
│   │   └── main.jsx            # Application entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js backend application
│   ├── config/                  # Configuration files
│   │   └── database.js         # MongoDB connection
│   ├── controllers/             # Business logic controllers
│   │   ├── authController.js   # Authentication logic
│   │   ├── expenseController.js # Expense management
│   │   ├── goalController.js   # Goals management
│   │   └── portfolioController.js # Portfolio management
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Error handling
│   │   └── rateLimiter.js     # Rate limiting
│   ├── models/                 # Database models
│   │   ├── User.js           # User schema
│   │   ├── Expense.js        # Expense schema
│   │   ├── Goal.js           # Goal schema
│   │   └── Portfolio.js      # Portfolio schema
│   ├── routes/                # API route definitions
│   │   ├── auth.js          # Authentication routes
│   │   ├── expenses.js      # Expense routes
│   │   ├── goals.js         # Goal routes
│   │   └── portfolio.js     # Portfolio routes
│   ├── server.js            # Main server file
│   └── package.json
│
└── README.md                   # Project documentation
```

## 🔧 Backend Architecture

### 1. Server Configuration (server.js)
The main server file sets up the Express application with:
- CORS configuration for cross-origin requests
- JSON parsing middleware
- Rate limiting for API protection
- Database connection
- Route mounting
- Error handling middleware

```javascript
// Key features:
- Environment-based configuration
- MongoDB Atlas connection
- JWT-based authentication
- RESTful API endpoints
- Error handling and logging
```

### 2. Database Models (models/)

#### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  income: {
    monthly: Number,
    annual: Number,
    source: String
  },
  budgetRule: String,
  customBudget: Object,
  riskAppetite: String,
  investmentGoals: [String],
  createdAt: Date
}
```

#### Expense Model
```javascript
{
  userId: ObjectId,
  amount: Number,
  category: String,
  description: String,
  date: Date,
  type: String
}
```

#### Portfolio Model
```javascript
{
  userId: ObjectId,
  name: String,
  type: String,
  symbol: String,
  quantity: Number,
  averageBuyPrice: Number,
  currentPrice: Number,
  dateAdded: Date
}
```

### 3. Controllers (controllers/)

Controllers handle the business logic and database operations:

#### AuthController
- User registration with password hashing
- Login with JWT token generation
- Profile management
- Password validation

#### ExpenseController
- CRUD operations for expenses
- Expense analytics and reporting
- Category-wise expense tracking
- Monthly/yearly expense trends

#### PortfolioController
- Investment tracking
- Real-time price updates via Finnhub API
- Portfolio performance calculation
- Buy/sell transaction management

#### GoalController
- Financial goal setting
- Progress tracking
- Goal completion status

### 4. Middleware (middleware/)

#### Authentication Middleware (auth.js)
```javascript
// Protects routes requiring authentication
- Validates JWT tokens
- Extracts user information
- Handles token expiration
```

#### Rate Limiter (rateLimiter.js)
```javascript
// Prevents API abuse
- Limits requests per IP
- Configurable time windows
- Custom error responses
```

#### Error Handler (errorHandler.js)
```javascript
// Centralized error handling
- Formats error responses
- Logs errors for debugging
- Handles different error types
```

### 5. API Routes (routes/)

RESTful API endpoints following conventional patterns:

```
Authentication:
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile

Expenses:
GET /api/expenses - Get user expenses
POST /api/expenses - Create new expense
PUT /api/expenses/:id - Update expense
DELETE /api/expenses/:id - Delete expense
GET /api/expenses/stats - Get expense analytics

Portfolio:
GET /api/portfolio - Get user portfolio
POST /api/portfolio - Add investment
PUT /api/portfolio/:id - Update investment
DELETE /api/portfolio/:id - Remove investment

Goals:
GET /api/goals - Get user goals
POST /api/goals - Create new goal
PUT /api/goals/:id - Update goal
DELETE /api/goals/:id - Delete goal
```

## 🎨 Frontend Architecture

### 1. Component Structure

#### Authentication Flow
```javascript
AuthContainer → Login/Signup → Dashboard
```

#### Main Dashboard
```javascript
Dashboard → Sidebar + Content Area
├── DashboardOverview (Home)
├── ExpensesTab
├── PortfolioTab
├── GoalsTab
├── RecommendationsDashboard
├── AIAdviser
└── SettingsTab
```

#### Setup Wizard
```javascript
FinanceWizard → Multi-step form
├── IncomeEntry
├── BudgetRuleSelection
├── ExpensesAllocation
├── RiskAppetiteSelection
└── Recommendations
```

### 2. State Management

#### Context Providers
- **AuthContext**: User authentication state
- **WizardContext**: Setup wizard data
- **BudgetContext**: Budget calculations

#### Key Features
- Persistent storage in localStorage
- Real-time data synchronization
- Optimistic UI updates

### 3. API Integration (api/)

#### Client Configuration
```javascript
// Centralized HTTP client
- Base URL configuration
- Request/response interceptors
- Error handling
- Token management
```

#### External API Integration
- **Finnhub**: Real-time stock prices
- **Gemini AI**: Financial advice generation

## 🔄 Frontend-Backend Synchronization

### 1. Authentication Flow
```
1. User submits login credentials
2. Frontend sends POST to /api/auth/login
3. Backend validates credentials
4. JWT token returned to frontend
5. Token stored in localStorage
6. Token included in subsequent requests
7. Backend validates token on protected routes
```

### 2. Data Flow
```
Frontend Request → API Layer → Backend Route → Controller → Database
                                                    ↓
Frontend Update ← Response ← JSON Response ← Business Logic
```

### 3. Real-time Updates
- Portfolio prices updated via external APIs
- Expense analytics calculated on-demand
- Dashboard metrics refreshed automatically

## 🚀 How It Works

### 1. User Onboarding
1. **Registration**: New users create accounts with secure password hashing
2. **Finance Wizard**: Step-by-step setup collecting income, budget preferences, and risk appetite
3. **Budget Allocation**: Automatic calculation using 50-30-20 rule or custom percentages
4. **Goal Setting**: Users define financial objectives and timelines

### 2. Expense Tracking
1. **Manual Entry**: Users add expenses with categories and descriptions
2. **Analytics**: Automatic calculation of spending patterns and budget utilization
3. **Visualization**: Charts and graphs showing expense trends
4. **Budget Monitoring**: Real-time alerts for budget overruns

### 3. Investment Management
1. **Portfolio Creation**: Users add investments with purchase details
2. **Real-time Pricing**: Finnhub API provides current market prices
3. **Performance Tracking**: Automatic calculation of gains/losses
4. **Diversification Analysis**: Portfolio breakdown by asset type

### 4. AI-Powered Advice
1. **Data Analysis**: Gemini AI analyzes user's financial profile
2. **Personalized Recommendations**: Custom advice based on spending patterns
3. **Investment Suggestions**: Risk-appropriate investment recommendations
4. **Goal Optimization**: Strategies to achieve financial objectives

### 5. Security Features
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless authentication with tokens
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Secure error responses without sensitive data

## 📊 Key Features

### Dashboard Analytics
- Monthly income vs expenses
- Budget utilization percentage
- Portfolio performance metrics
- Savings rate tracking

### Investment Recommendations
- Risk-based asset allocation
- Popular platform integration (Upstox, Zerodha, Groww, Angel One)
- Real-time market data
- Performance tracking

### AI Financial Advisor
- Personalized financial advice
- Spending pattern analysis
- Investment recommendations
- Goal achievement strategies

### Budget Management
- Multiple budgeting rules (50-30-20, 60-20-20, custom)
- Category-wise expense tracking
- Budget vs actual spending analysis
- Savings optimization

## 🔧 Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Finnhub API key
- Google Gemini API key

### Backend Setup
```bash
cd backend
npm install
# Configure environment variables
npm start # Runs on port 3000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev # Runs on port 5173
```

### Environment Variables
```
# Backend (.env)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FINNHUB_API_KEY=your_finnhub_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=3000

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3000
```

## 🚀 Deployment

The application is designed for deployment on:
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Render, Heroku, or any Node.js hosting
- **Database**: MongoDB Atlas (cloud)

## 📈 Performance Optimizations

- **Frontend**: Code splitting, lazy loading, optimized builds
- **Backend**: Database indexing, connection pooling, response caching
- **API**: Rate limiting, request validation, error handling
- **Security**: JWT tokens, password hashing, CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using modern web technologies for seamless personal finance management.