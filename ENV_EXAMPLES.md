# 🔧 Environment Variables Guide

## Frontend Environment Variables (.env.local)

```bash
# Update this with your Railway backend URL
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app

# Examples:
# NEXT_PUBLIC_API_URL=https://wega-backend-production.up.railway.app
# NEXT_PUBLIC_API_URL=https://wega-kitchenware-backend.railway.app
```

## Backend Environment Variables (Railway Dashboard)

Set these in your Railway project dashboard:

### Required Variables:
```bash
# Database (Railway will provide this)
DATABASE_URL=postgresql://username:password@host:port/database

# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-secret-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dy082ykuf
CLOUDINARY_API_KEY=467453488849521
CLOUDINARY_API_SECRET=hcevXMTHU3PiVjxCmRLbcqYzFNw

# CORS Configuration
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

## 🚀 Railway Setup Steps:

1. **Get your Railway URL** after deployment
2. **Update frontend .env.local**:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
   ```
3. **Set backend variables** in Railway dashboard:
   - Go to your Railway project
   - Click "Variables" tab
   - Add all the backend variables above

## 🔍 Current Issues:

- Frontend points to `localhost:5000` ❌
- Backend uses SQLite instead of PostgreSQL ❌
- Missing Railway environment variables ❌

## ✅ After Fix:

- Frontend will point to Railway URL ✅
- Backend will use Railway PostgreSQL ✅
- All environment variables set ✅ 