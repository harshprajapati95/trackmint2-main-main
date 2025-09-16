# 💰 TrackMint - Personal Finance Dashboard

A modern, full-stack personal finance management application with AI-powered insights, expense tracking, and investment portfolio management.

## 🏗️ Project Structure

```
trackmint2-main-main/
├── 🎨 frontend/              # React.js Frontend (Port 5173)
│   ├── src/                  # React components & logic
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   ├── .env                  # Frontend environment variables
│   └── README.md             # Frontend documentation
├── 🛠️ backend/               # Express.js Backend API
│   ├── config/               # Database configuration
│   ├── controllers/          # API route handlers
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   └── middleware/           # Authentication & error handling
├── 🚀 server.js              # Backend server entry point (Port 3000)
├── .env                      # Backend environment variables
├── package.json              # Root project & scripts
└── .github/workflows/        # Auto-deployment pipelines
```

## ⚡ Quick Start

### 1️⃣ Clone & Install
```bash
git clone https://github.com/harshprajapati95/trackmint2-main-main.git
cd trackmint2-main-main

# Install all dependencies (backend + frontend)
npm run install-all
```

### 2️⃣ Environment Setup

**Root `.env` (Backend):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trackmint
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
PORT=3000
```

**`frontend/.env` (Frontend):**
```env
VITE_API_URL=http://localhost:3000/api
VITE_FINNHUB_API_KEY=your_finnhub_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3️⃣ Run the Application

**🎯 Option 1: Run Both Servers Simultaneously (Recommended)**
```bash
npm run dev-all
```
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

**🔀 Option 2: Run Servers Separately**
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend  
npm run dev-frontend
```

## 🌐 Deployment Guide

### 📤 Frontend Deployment (Static Hosting)

**Build for Production:**
```bash
npm run build
# or
npm run deploy-frontend
```

**Deploy to GitHub Pages:**
1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Use GitHub Actions workflow (auto-configured)

**Deploy to Netlify/Vercel:**
- **Build Command:** `cd frontend && npm run build`
- **Publish Directory:** `frontend/dist`
- **Environment Variables:** Add your API keys in hosting dashboard

### 🖥️ Backend Deployment (API Server)

**Deploy to Railway:**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

**Deploy to Render/Heroku:**
- **Root Directory:** Deploy entire repository
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Port:** Environment variable `PORT` (auto-detected)

**Update Frontend After Backend Deployment:**
```bash
# Update frontend/.env with your deployed backend URL
VITE_API_URL=https://your-backend-app.railway.app/api
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | 🚀 Start production backend server |
| `npm run dev` | 🛠️ Start backend with auto-reload |
| `npm run dev-all` | 🎯 Start both backend & frontend |
| `npm run dev-frontend` | 🎨 Start only frontend dev server |
| `npm run install-all` | 📦 Install all dependencies |
| `npm run build` | 🏗️ Build frontend for production |
| `npm run build-all` | 📊 Install deps + build frontend |
| `npm run deploy-frontend` | 🚀 Build + deployment instructions |

## 🎯 Features

- 💳 **Smart Expense Tracking** - Automatic categorization & insights
- 🎯 **Goal Management** - Set & monitor financial objectives
- 📈 **Portfolio Tracking** - Real-time investment monitoring
- 🤖 **AI Financial Advisor** - Voice-enabled personalized advice
- 📱 **Responsive Design** - Optimized for all devices
- 🔐 **Secure Authentication** - JWT-based user management
- 📊 **Rich Analytics** - Interactive charts & visualizations

## 🔑 API Keys Required

| Service | Purpose | Get Key From |
|---------|---------|--------------|
| **MongoDB Atlas** | Database hosting | [mongodb.com](https://cloud.mongodb.com) |
| **Finnhub API** | Stock market data | [finnhub.io](https://finnhub.io) |
| **Google Gemini** | AI insights | [ai.google.dev](https://ai.google.dev) |

## 🚨 Troubleshooting

**❌ "Network Error" during login:**
- ✅ Ensure backend is running on port 3000
- ✅ Check `frontend/.env` has correct `VITE_API_URL`
- ✅ Verify CORS settings in `server.js`

**❌ Build failures:**
- ✅ Use Node.js 18+ (`node --version`)
- ✅ Clear cache: `rm -rf node_modules && npm install`
- ✅ Check all environment variables are set

**❌ MongoDB connection issues:**
- ✅ Verify `MONGODB_URI` in `.env`
- ✅ Check IP whitelist in MongoDB Atlas
- ✅ Ensure network access is configured

## 🛡️ Security

- 🔐 Environment variables for sensitive data
- 🛡️ CORS protection configured
- 🚫 Rate limiting on API endpoints
- 🔑 JWT token-based authentication
- 📝 Input validation & sanitization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**🎉 Ready to manage your finances like a pro? Get started now!**