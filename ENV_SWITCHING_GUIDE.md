# 🔄 Environment Switching Guide

## 🏠 Localhost Development

### Frontend (.env.local):
```bash
# For localhost development
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (backend/.env):
```bash
# Local development only - Railway uses environment variables
DATABASE_URL=sqlite:///app.db
FLASK_ENV=development
```

## 🚀 Production (Railway)

### Frontend (.env.local):
```bash
# For Railway production
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

### Backend (Railway Dashboard):
```bash
FLASK_ENV=production
DATABASE_URL=postgresql://... (Railway provides)
CLOUDINARY_CLOUD_NAME=dy082ykuf
CLOUDINARY_API_KEY=467453488849521
CLOUDINARY_API_SECRET=hcevXMTHU3PiVjxCmRLbcqYzFNw
```

## 🔧 Quick Switching Commands

### Switch to Localhost:
```bash
# Frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Backend (already set for localhost)
# backend/.env is already configured for localhost
```

### Switch to Production:
```bash
# Frontend
echo "NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app" > .env.local

# Backend (set in Railway dashboard)
# No local file changes needed
```

## 🎯 Development Workflow

1. **Local Development**:
   ```bash
   # Terminal 1: Start backend
   cd backend
   python run.py
   
   # Terminal 2: Start frontend
   npm run dev
   ```

2. **Production Testing**:
   - Update `.env.local` with Railway URL
   - Test frontend against Railway backend
   - Switch back to localhost for development

3. **Easy Switching**:
   ```bash
   # Quick localhost switch
   sed -i 's|https://.*railway\.app|http://localhost:5000/api|' .env.local
   
   # Quick production switch
   sed -i 's|http://localhost:5000/api|https://your-railway-app.railway.app|' .env.local
   ```

## ✅ Benefits

- ✅ **Localhost works perfectly** for development
- ✅ **Production works** on Railway
- ✅ **Easy switching** between environments
- ✅ **No code changes** needed
- ✅ **Same codebase** for both environments

## 🚨 Important Notes

- **Frontend**: Only `.env.local` needs to change
- **Backend**: Railway uses dashboard variables, local `.env` ignored
- **Database**: SQLite locally, PostgreSQL on Railway
- **Environment**: Development locally, Production on Railway 