# Production Deployment Guide

## Overview

This guide explains how to deploy the WEGA Kitchenware e-commerce application to production with working admin login functionality.

## Prerequisites

- Backend deployed and accessible
- Frontend deployment platform (Vercel, Netlify, etc.)
- Environment variables configured

## Backend Deployment

### 1. Deploy Backend First

Deploy your Flask backend to your preferred platform:
- **Railway**: `wega-production-28c0.up.railway.app`
- **Render**: `wega-backend.onrender.com`
- **Heroku**: Your custom domain

### 2. Set Backend Environment Variables

```bash
# Database
DATABASE_URL=your_database_url

# Security
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret

# CORS (comma-separated list of frontend URLs)
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# WhatsApp
WHATSAPP_PHONE_NUMBER=254774639253

# Environment
FLASK_ENV=production
```

## Frontend Deployment

### 1. Environment Variables Setup

#### For Vercel:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

# Example for Railway backend:
NEXT_PUBLIC_API_URL=https://wega-production-28c0.up.railway.app/api

# Example for Render backend:
NEXT_PUBLIC_API_URL=https://wega-backend.onrender.com/api

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER=254774639253

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dy082ykuf

# Environment
NODE_ENV=production
```

#### For Netlify:
1. Go to Site settings → Environment variables
2. Add the same variables as above

#### For Railway Frontend:
1. Go to your Railway project
2. Navigate to Variables tab
3. Add the environment variables

### 2. Deploy Frontend

```bash
# Build the application
npm run build

# Deploy to your platform
# Vercel: vercel --prod
# Netlify: netlify deploy --prod
# Railway: git push railway main
```

## Admin Login Configuration

### 1. Verify Backend URL

Ensure your backend is accessible and the admin login endpoint works:

```bash
# Test backend health
curl https://your-backend-domain.com/api/health

# Test admin login endpoint (should return 401 for unauthorized)
curl -X POST https://your-backend-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### 2. Check CORS Configuration

Verify your backend allows requests from your frontend domain:

```bash
# Test CORS preflight
curl -X OPTIONS https://your-backend-domain.com/api/admin/login \
  -H "Origin: https://your-frontend-domain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

### 3. Admin Account Setup

Ensure you have admin accounts in your production database:

```python
# Run this script on your production backend
from backend.models import db, AdminUser
from werkzeug.security import generate_password_hash

# Create admin user
admin = AdminUser(
    username='admin',
    email='admin@wega-kitchenware.com',
    password_hash=generate_password_hash('your_secure_password'),
    role='admin',
    is_active=True
)

db.session.add(admin)
db.session.commit()
```

## Testing Admin Login

### 1. Test Locally First

```bash
# Set environment variable for local testing
export NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

# Start development server
npm run dev

# Navigate to http://localhost:3000/admin/login
# Test with admin credentials
```

### 2. Test Production Deployment

1. Navigate to `https://your-frontend-domain.com/admin/login`
2. Enter admin credentials
3. Verify successful login and redirect to admin dashboard

### 3. Debug Common Issues

#### Issue: "Network Error" or "Failed to fetch"
**Solution**: Check API URL configuration
```bash
# Verify environment variable is set
echo $NEXT_PUBLIC_API_URL

# Check browser console for actual API calls
# Should show: https://your-backend-domain.com/api/admin/login
```

#### Issue: CORS Error
**Solution**: Update backend CORS configuration
```python
# Add your frontend domain to CORS_ORIGINS
CORS_ORIGINS = [
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com'
]
```

#### Issue: "Invalid credentials"
**Solution**: Verify admin account exists
```python
# Check admin users in database
from backend.models import AdminUser
admins = AdminUser.query.all()
print([admin.username for admin in admins])
```

## Environment-Specific Configurations

### Development
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### Staging
```bash
NEXT_PUBLIC_API_URL=https://staging-backend.railway.app/api
NODE_ENV=production
```

### Production
```bash
NEXT_PUBLIC_API_URL=https://wega-production-28c0.up.railway.app/api
NODE_ENV=production
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use platform-specific environment variable management
- Rotate secrets regularly

### 2. CORS Configuration
- Only allow necessary origins
- Use HTTPS in production
- Regularly review and update allowed domains

### 3. Admin Authentication
- Use strong passwords
- Enable rate limiting
- Monitor login attempts
- Consider 2FA for admin accounts

## Monitoring and Debugging

### 1. Frontend Logs
```javascript
// Add to your components for debugging
console.log('API_BASE_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Current hostname:', window.location.hostname);
```

### 2. Backend Logs
```python
# Check backend logs for authentication attempts
# Monitor for failed login attempts
# Track CORS errors
```

### 3. Network Tab
- Open browser dev tools
- Check Network tab during login
- Verify API calls are going to correct URL
- Check response status codes

## Troubleshooting Checklist

- [ ] Backend is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] CORS is configured for frontend domain
- [ ] Admin account exists in production database
- [ ] API endpoints are working (test with curl)
- [ ] Frontend is deployed with correct environment variables
- [ ] No console errors in browser
- [ ] Network requests are going to correct backend URL

## Support

If you encounter issues:

1. Check this guide
2. Verify environment variables
3. Test backend endpoints directly
4. Check browser console for errors
5. Review backend logs
6. Contact development team

---

**Last Updated**: December 2024
**Version**: 1.0
