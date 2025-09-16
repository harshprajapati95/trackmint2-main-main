# TrackMint - Personal Finance Dashboard

A modern, full-stack personal finance management application with AI-powered insights.

## 🏗️ Project Structure

```
trackmint2-main-main/
├── frontend/           # React.js frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── .env           # Frontend environment variables
├── backend/           # Express.js backend API
│   ├── config/        # Database configuration
│   ├── controllers/   # API controllers
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   └── package.json   # Backend dependencies
├── server.js          # Backend server entry point
└── .env               # Backend environment variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Git

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/trackmint2-main-main.git
cd trackmint2-main-main

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Setup

**Backend (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Frontend (frontend/.env):**
```env
VITE_API_URL=http://localhost:3000/api
VITE_FINNHUB_API_KEY=your_finnhub_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the Application

**Option 1: Run both servers (Recommended)**
```bash
# Terminal 1: Start backend server
npm start
# Backend runs on http://localhost:3000

# Terminal 2: Start frontend development server  
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

**Option 2: Development mode**
```bash
# Backend with auto-reload
npm run dev

# Frontend (in separate terminal)
cd frontend  
npm run dev
```

## 🌐 Deployment

### Frontend Deployment (Static Hosting)

**Build for production:**
```bash
cd frontend
npm run build
```

**Deploy to GitHub Pages:**
1. Push your code to GitHub
2. Go to Settings > Pages
3. Select source: GitHub Actions or Deploy from branch
4. Upload the `frontend/dist` folder

**Deploy to Netlify/Vercel:**
1. Connect your GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/dist`
4. Add environment variables in hosting dashboard

### Backend Deployment (API Server)

**Deploy to Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Deploy to Render/Heroku:**
1. Create new app on hosting platform
2. Connect GitHub repository  
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

**Update Frontend API URL:**
After deploying backend, update `frontend/.env`:
```env
VITE_API_URL=https://your-backend-url.herokuapp.com/api
```

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Backend Development  
```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
```

## 📋 Features

- 💰 **Expense Tracking** - Smart categorization and analytics
- 🎯 **Goal Management** - Set and track financial goals  
- 📊 **Portfolio Tracking** - Investment monitoring with real-time data
- 🤖 **AI Financial Advisor** - Voice-enabled personalized advice
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔐 **Secure Authentication** - JWT-based user management

## 🔑 API Keys Required

1. **MongoDB Atlas** - Database hosting
2. **Finnhub API** - Stock market data
3. **Google Gemini API** - AI-powered insights

## 🐛 Common Issues

**"Network Error" during login/signup:**
- Ensure backend server is running on port 3000
- Check if API URL is correct in frontend/.env
- Verify CORS settings in backend

**Build errors:**
- Check Node.js version (18+ required)
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

**MongoDB connection issues:**
- Verify MONGODB_URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure network access is configured

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`  
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details.