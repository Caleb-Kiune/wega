# Deployment Checklist - Custom Admin Credentials

## 🎯 Goal: Set Custom Admin Password for Production

This checklist will help you deploy with custom admin credentials on Vercel (frontend) and Render (backend).

## 📋 Pre-Deployment Checklist

### ✅ Backend Preparation (Render)
- [ ] Backend code is ready for deployment
- [ ] Database is set up and accessible
- [ ] You have your Render service URL

### ✅ Frontend Preparation (Vercel)
- [ ] Frontend code is ready for deployment
- [ ] You have your Vercel project URL
- [ ] Build passes locally (`npm run build`)

## 🚀 Step 1: Backend Deployment (Render)

### 1.1 Access Render Dashboard
1. Go to [render.com](https://render.com)
2. Sign in to your account
3. Navigate to your backend service

### 1.2 Set Environment Variables
In your Render service dashboard:

1. Go to **Environment** tab
2. Click **Add Environment Variable**
3. Add these variables one by one:

```bash
# Admin Authentication (CUSTOMIZE THESE)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_EMAIL=admin@wega-kitchenware.com
DEFAULT_ADMIN_PASSWORD=WegaAdmin2024!

# Database (if not already set)
DATABASE_URL=your_database_url

# Security (GENERATE NEW ONES)
SECRET_KEY=your_secure_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here

# CORS (REPLACE WITH YOUR VERCEL URL)
CORS_ORIGINS=https://your-vercel-app.vercel.app,https://www.your-vercel-app.vercel.app

# Environment
FLASK_ENV=production

# WhatsApp
WHATSAPP_PHONE_NUMBER=254774639253
```

### 1.3 Generate Secure Keys
For `SECRET_KEY` and `JWT_SECRET_KEY`, generate secure random strings:

```bash
# Option 1: Use Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 2: Use online generator
# Go to https://generate-secret.vercel.app/32
```

### 1.4 Redeploy Backend
1. Go to **Manual Deploy** tab
2. Click **Deploy latest commit**
3. Wait for deployment to complete
4. **IMPORTANT**: Check deployment logs for admin user creation

### 1.5 Verify Backend Deployment
Check your backend logs for this message:
```
✅ Default admin user created
   Username: admin
   Password: WegaAdmin2024!
```

## 🌐 Step 2: Frontend Deployment (Vercel)

### 2.1 Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Navigate to your project

### 2.2 Set Environment Variables
In your Vercel project dashboard:

1. Go to **Settings** tab
2. Click **Environment Variables** in left sidebar
3. Add these variables:

```bash
# API Configuration (REPLACE WITH YOUR RENDER URL)
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com/api

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER=254774639253

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dy082ykuf

# Environment
NODE_ENV=production
```

### 2.3 Deploy Frontend
1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Wait for deployment to complete

## 🔍 Step 3: Verification

### 3.1 Run Verification Script
```bash
# Install requests if needed
pip install requests

# Run verification script
python verify-deployment.py
```

### 3.2 Manual Testing
1. **Test Backend Health:**
   ```bash
   curl https://your-render-backend.onrender.com/api/health
   ```

2. **Test Admin Login Endpoint:**
   ```bash
   curl -X POST https://your-render-backend.onrender.com/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"WegaAdmin2024!"}'
   ```

3. **Test Frontend Admin Login:**
   - Go to `https://your-vercel-app.vercel.app/admin/login`
   - Enter credentials:
     - Username: `admin`
     - Password: `WegaAdmin2024!`

## 🛠️ Troubleshooting

### Issue: Backend Not Accessible
**Solution:**
- Check Render service status
- Verify environment variables are set
- Check deployment logs for errors

### Issue: Admin Login Fails
**Solution:**
- Verify admin user was created (check backend logs)
- Confirm password matches environment variable
- Check if admin user exists in database

### Issue: CORS Errors
**Solution:**
- Add your Vercel URL to `CORS_ORIGINS` in Render
- Redeploy backend after updating CORS
- Check browser console for CORS error details

### Issue: Frontend Can't Connect to Backend
**Solution:**
- Verify `NEXT_PUBLIC_API_URL` is correct in Vercel
- Check if backend URL is accessible
- Ensure environment variables are set correctly

## 🔐 Security Best Practices

### ✅ Password Requirements
- Use at least 12 characters
- Include uppercase, lowercase, numbers, and symbols
- Avoid common words or patterns
- Example: `WegaAdmin2024!`

### ✅ Environment Variable Security
- Never commit environment variables to version control
- Use platform-specific environment variable management
- Rotate secrets regularly
- Use different secrets for different environments

### ✅ Production Security
- Enable HTTPS only
- Set secure cookie flags
- Implement rate limiting
- Monitor login attempts

## 📞 Support

If you encounter issues:

1. **Check this checklist** - ensure all steps are completed
2. **Run verification script** - identify specific issues
3. **Check platform logs** - Render and Vercel provide detailed logs
4. **Test endpoints manually** - use curl or Postman
5. **Contact support** - if issues persist

## 🎉 Success Criteria

Your deployment is successful when:

- [ ] Backend is accessible and healthy
- [ ] Admin user is created with custom credentials
- [ ] Frontend can connect to backend
- [ ] Admin login works with custom password
- [ ] No CORS errors in browser console
- [ ] All environment variables are set correctly

---

**Last Updated**: December 2024
**Version**: 1.0
