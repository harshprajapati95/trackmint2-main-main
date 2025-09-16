# 🚀 TrackMint Render Deployment Guide

This guide will help you deploy TrackMint to Render as separate backend and frontend services.

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Ensure your database is accessible from external IPs

## 🎯 Deployment Strategy

- **Backend**: Web Service (Node.js)
- **Frontend**: Static Site (React/Vite)

## 🔧 Step 1: Deploy Backend (Web Service)

### 1.1 Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

```
Name: trackmint-backend
Runtime: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 1.2 Environment Variables
Add these environment variables in Render dashboard:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://hp6173585:harsh123@cluster0.jlvsoq2.mongodb.net/trackmint?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-production-jwt-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=https://trackmint-frontend.onrender.com
```

**⚠️ Important Notes:**
- Replace `JWT_SECRET` with a strong, unique secret
- The `CORS_ORIGIN` will be updated after frontend deployment
- Keep your MongoDB credentials secure

### 1.3 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Note your backend URL: `https://trackmint-backend-xyz.onrender.com`

## 🎨 Step 2: Deploy Frontend (Static Site)

### 2.1 Create Static Site
1. Go to Render Dashboard
2. Click **"New"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the site:

```
Name: trackmint-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
Plan: Free
```

### 2.2 Environment Variables
Add these environment variables for the frontend build:

```env
VITE_API_URL=https://trackmint-backend-xyz.onrender.com/api
VITE_FINNHUB_API_KEY=d2nar4pr01qn3vmk8j90d2nar4pr01qn3vmk8j9g
VITE_GEMINI_API_KEY=AIzaSyDzAfYtlht_MpW1JMQhq0kSEtFU6Fm7Uvs
GENERATE_SOURCEMAP=false
CI=false
```

**⚠️ Important:**
- Replace `trackmint-backend-xyz.onrender.com` with your actual backend URL
- Replace API keys with your actual keys

### 2.3 Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment to complete
3. Note your frontend URL: `https://trackmint-frontend-abc.onrender.com`

## 🔄 Step 3: Update Backend CORS

### 3.1 Update CORS Origin
1. Go to your backend service settings
2. Update the `CORS_ORIGIN` environment variable:
```env
CORS_ORIGIN=https://trackmint-frontend-abc.onrender.com
```
3. Save and redeploy the backend service

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend
Visit: `https://trackmint-backend-xyz.onrender.com/health`

Expected response:
```json
{
  "status": "OK",
  "message": "TrackMint API is running!",
  "environment": "production",
  "timestamp": "2025-09-16T..."
}
```

### 4.2 Test Frontend
1. Visit your frontend URL
2. Try to sign up/login
3. Verify API calls work in browser console

## 🚨 Common Issues & Solutions

### Issue 1: Backend Not Starting
**Symptoms**: Build succeeds but service fails to start
**Solutions**:
- Check MongoDB URI is correct
- Verify all environment variables are set
- Check logs for specific error messages

### Issue 2: CORS Errors
**Symptoms**: Frontend can't connect to backend
**Solutions**:
- Ensure `CORS_ORIGIN` matches exact frontend URL
- Check both services are deployed successfully
- Verify frontend uses correct `VITE_API_URL`

### Issue 3: Cold Start Delays
**Symptoms**: First request takes 30+ seconds
**Solutions**:
- This is normal for Render free tier
- Consider upgrading to paid plan for better performance
- Implement loading states in frontend

### Issue 4: Build Failures
**Symptoms**: Frontend build fails
**Solutions**:
- Check all `VITE_` environment variables are set
- Verify no TypeScript errors
- Check build logs for specific errors

## 🔧 Environment Variables Reference

### Backend Environment Variables
```env
NODE_ENV=production                    # Required
MONGODB_URI=mongodb+srv://...          # Required
JWT_SECRET=your-secret-key             # Required
JWT_EXPIRE=7d                          # Optional
CORS_ORIGIN=https://your-frontend.com  # Required
```

### Frontend Environment Variables
```env
VITE_API_URL=https://your-backend.com/api  # Required
VITE_FINNHUB_API_KEY=your-key             # Optional
VITE_GEMINI_API_KEY=your-key              # Optional
GENERATE_SOURCEMAP=false                   # Recommended
CI=false                                   # Recommended
```

## 📱 Final URLs
After successful deployment, your application will be available at:

- **Frontend**: `https://trackmint-frontend-abc.onrender.com`
- **Backend API**: `https://trackmint-backend-xyz.onrender.com`
- **Health Check**: `https://trackmint-backend-xyz.onrender.com/health`

## 🎉 Congratulations!
Your TrackMint application is now live on Render! 

## 🛠️ Maintenance

### Automatic Deployments
- Push to `main` branch triggers automatic redeployment
- Both services will rebuild and redeploy

### Monitoring
- Check Render dashboard for service health
- Monitor logs for any issues
- Set up uptime monitoring if needed

### Updates
- Update environment variables as needed
- Monitor performance and upgrade plans if necessary

---

**Need Help?**
- Check Render documentation: [docs.render.com](https://docs.render.com)
- Review service logs in Render dashboard
- Verify all environment variables are correctly set