# 🚀 Frontend Deployment Instructions

## Your Backend is Live! ✅
**Backend URL**: https://trackmint2-main-main.onrender.com

## 🎨 Deploy Frontend (Static Site)

### Step 1: Create Static Site on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Static Site"**
3. Connect your GitHub repository: `harshprajapati95/trackmint2-main-main`

### Step 2: Configure Static Site
```
Name: trackmint-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
Auto-Deploy: Yes
```

### Step 3: Add Environment Variables
In the Render Environment section, add these variables:

```env
VITE_API_URL=https://trackmint2-main-main.onrender.com/api
VITE_FINNHUB_API_KEY=d2nar4pr01qn3vmk8j90d2nar4pr01qn3vmk8j9g
VITE_GEMINI_API_KEY=AIzaSyDzAfYtlht_MpW1JMQhq0kSEtFU6Fm7Uvs
GENERATE_SOURCEMAP=false
CI=false
```

### Step 4: Deploy Frontend
Click **"Create Static Site"** and wait for deployment to complete.

### Step 5: Update Backend CORS
After frontend deployment, you'll get a URL like:
`https://trackmint-frontend-xyz.onrender.com`

Then update your backend service:
1. Go to your backend service in Render
2. Environment → Update:
   ```env
   CORS_ORIGIN=https://your-actual-frontend-url.onrender.com
   ```
3. Save and redeploy

## 🧪 Test Your Backend Right Now
- **Health Check**: https://trackmint2-main-main.onrender.com/health
- **API Root**: https://trackmint2-main-main.onrender.com/api

## 📱 Expected Final URLs
- **Backend**: https://trackmint2-main-main.onrender.com
- **Frontend**: https://trackmint-frontend-xyz.onrender.com

## ⏱️ Deployment Time
- Frontend build: 5-10 minutes
- Total deployment: ~15 minutes

Start the frontend deployment now! 🚀