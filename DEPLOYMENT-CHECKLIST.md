# 📋 Render Deployment Checklist

## Pre-Deployment ✅

- [ ] Code pushed to GitHub repository
- [ ] Render account created
- [ ] MongoDB Atlas accessible from external IPs
- [ ] Environment variables prepared

## Backend Deployment ✅

- [ ] Create Web Service on Render
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=mongodb+srv://...`
  - [ ] `JWT_SECRET=strong-secret-key`
  - [ ] `JWT_EXPIRE=7d`
  - [ ] `CORS_ORIGIN=https://frontend-url.onrender.com`
- [ ] Deploy and verify health check

## Frontend Deployment ✅

- [ ] Create Static Site on Render
- [ ] Set Root Directory: `frontend`
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Publish Directory: `dist`
- [ ] Add environment variables:
  - [ ] `VITE_API_URL=https://backend-url.onrender.com/api`
  - [ ] `VITE_FINNHUB_API_KEY=your-key`
  - [ ] `VITE_GEMINI_API_KEY=your-key`
  - [ ] `GENERATE_SOURCEMAP=false`
  - [ ] `CI=false`
- [ ] Deploy and verify site loads

## Post-Deployment ✅

- [ ] Update backend `CORS_ORIGIN` with actual frontend URL
- [ ] Redeploy backend service
- [ ] Test full application functionality
- [ ] Verify API calls work from frontend
- [ ] Test user registration/login flow

## URLs to Save 📝

- Backend URL: `https://trackmint-backend-_____.onrender.com`
- Frontend URL: `https://trackmint-frontend-_____.onrender.com`
- Health Check: `https://trackmint-backend-_____.onrender.com/health`

## Quick Commands 🚀

### Local Testing
```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm run dev
```

### Build Testing
```bash
# Test backend build
cd backend && npm install && npm start

# Test frontend build
cd frontend && npm install && npm run build
```