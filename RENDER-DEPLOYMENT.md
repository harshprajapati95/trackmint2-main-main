# 🚀 Render Deployment Guide for TrackMint

This guide will help you deploy your TrackMint application to Render using their Web Service (backend) and Static Site (frontend) offerings.

## 📋 Deployment Overview

1. **Backend Web Service** → Hosts the Express.js API
2. **Frontend Static Site** → Hosts the React application

## 🛠️ Step 1: Deploy Backend (Web Service)

### 1.1 Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository: `trackmint2-main-main`

### 1.2 Configure Web Service
```yaml
Name: trackmint-backend
Root Directory: . (leave blank)
Environment: Node
Build Command: npm install
Start Command: npm start
```

### 1.3 Set Environment Variables
Add these in Render's Environment section:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://hp6173585:harsh123@cluster0.jlvsoq2.mongodb.net/trackmint?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-production-jwt-secret-key-here
JWT_EXPIRE=7d
```

### 1.4 Deploy Backend
- Click **"Create Web Service"**
- Wait for deployment (5-10 minutes)
- Note your backend URL: `https://trackmint-backend-XXXX.onrender.com`

## 🎨 Step 2: Deploy Frontend (Static Site)

### 2.1 Create Static Site
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Static Site"**
3. Connect the same GitHub repository

### 2.2 Configure Static Site
```yaml
Name: trackmint-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### 2.3 Set Environment Variables
Add these in Render's Environment section:
```env
VITE_API_URL=https://trackmint-backend-XXXX.onrender.com/api
VITE_FINNHUB_API_KEY=d2nar4pr01qn3vmk8j90d2nar4pr01qn3vmk8j9g
VITE_GEMINI_API_KEY=AIzaSyDzAfYtlht_MpW1JMQhq0kSEtFU6Fm7Uvs
```

**⚠️ Important:** Replace `trackmint-backend-XXXX.onrender.com` with your actual backend URL from Step 1.4

### 2.4 Deploy Frontend
- Click **"Create Static Site"**
- Wait for deployment (3-5 minutes)
- Note your frontend URL: `https://trackmint-frontend-XXXX.onrender.com`

## 🔄 Step 3: Update CORS Settings

### 3.1 Update Backend Environment Variables
Go back to your backend web service and add:
```env
CORS_ORIGIN=https://trackmint-frontend-XXXX.onrender.com
```

### 3.2 Redeploy Backend
- Go to your backend service dashboard
- Click **"Manual Deploy"** → **"Deploy latest commit"**

## ✅ Step 4: Test Your Deployment

1. **Visit your frontend URL**: `https://trackmint-frontend-XXXX.onrender.com`
2. **Test user registration/login**
3. **Check browser console** for any API errors
4. **Verify all features work** (expenses, goals, AI advisor)

## 🔧 Troubleshooting

### 🚨 Common Issues

**❌ "Network Error" on login:**
- ✅ Check VITE_API_URL is correct in frontend environment variables
- ✅ Verify backend service is running (green status in Render)
- ✅ Check CORS_ORIGIN matches your frontend URL exactly

**❌ Backend deployment fails:**
- ✅ Ensure all environment variables are set
- ✅ Check build logs for missing dependencies
- ✅ Verify MongoDB connection string is correct

**❌ Frontend build fails:**
- ✅ Ensure VITE_API_URL is set before building
- ✅ Check that all API keys are provided
- ✅ Verify Node.js version compatibility

### 🔍 Debug Steps

1. **Check deployment logs** in Render dashboard
2. **Monitor application logs** for runtime errors
3. **Test API endpoints** directly: `https://your-backend.onrender.com/api/health`
4. **Verify environment variables** are loaded correctly

## 🎯 Optimization Tips

### Performance
- Enable **auto-deploy** for automatic updates
- Use **preview deployments** for testing
- Monitor **service metrics** in Render dashboard

### Security
- Use strong JWT secrets in production
- Regularly rotate API keys
- Monitor access logs

### Cost Management
- Render free tier includes:
  - 750 hours/month for web services
  - Unlimited static sites
  - Auto-sleep for inactive services

## 🔄 Updating Your Application

1. **Push changes to GitHub**
2. **Auto-deploy triggers** (if enabled)
3. **Manual deploy** via Render dashboard if needed

## 📱 Final URLs

After successful deployment:
- **Frontend**: `https://trackmint-frontend-XXXX.onrender.com`
- **Backend API**: `https://trackmint-backend-XXXX.onrender.com/api`
- **Health Check**: `https://trackmint-backend-XXXX.onrender.com/api/health`

---

**🎉 Congratulations! Your TrackMint application is now live on Render!**