# 🚀 Cloudinary Setup Guide for Wega Kitchenware

This guide will help you set up Cloudinary for your Wega Kitchenware backend to resolve image loading issues on Render.

## 📋 Prerequisites

- ✅ Cloudinary account (free tier available)
- ✅ Backend deployed to Render
- ✅ Local images in `backend/static/uploads/`

## 🔑 Step 1: Get Your Cloudinary Credentials

1. **Login to Cloudinary Dashboard**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign in to your account

2. **Find Your Credentials**
   - In your dashboard, look for:
     - **Cloud Name** (e.g., `dy082ykuf`)
     - **API Key** (e.g., `123456789012345`)
     - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

3. **Copy These Values**
   - You'll need them for the next steps

## 🌍 Step 2: Set Environment Variables on Render

### Option A: Via Render Dashboard (Recommended)

1. **Go to Your Render Service**
   - Navigate to [render.com](https://render.com)
   - Select your `wega-backend` service

2. **Add Environment Variables**
   - Click on **Environment** tab
   - Click **Add Environment Variable**
   - Add these three variables:

   ```
   Key: CLOUDINARY_CLOUD_NAME
   Value: [Your Cloud Name]
   
   Key: CLOUDINARY_API_KEY
   Value: [Your API Key]
   
   Key: CLOUDINARY_API_SECRET
   Value: [Your API Secret]
   ```

3. **Save Changes**
   - Click **Save Changes**
   - Your service will automatically redeploy

### Option B: Via render.yaml (Advanced)

If you prefer to manage via code, update your `render.yaml`:

```yaml
services:
  - type: web
    name: wega-backend
    env: python
    plan: free
    buildCommand: |
      pip install -r requirements.txt
      flask db upgrade
    startCommand: gunicorn -w 4 -b 0.0.0.0:$PORT run:app
    envVars:
      - key: FLASK_ENV
        value: production
      - key: FLASK_DEBUG
        value: false
      - key: SECRET_KEY
        sync: false
      - key: DATABASE_URL
        fromDatabase:
          name: wega-backend-db
          property: connectionString
      - key: JWT_SECRET_KEY
        sync: false
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
      - key: CORS_ORIGINS
        sync: false
    autoDeploy: true
```

## 🖼️ Step 3: Upload Images to Cloudinary

### Local Development (Before Deploying)

1. **Set Local Environment Variables**
   ```bash
   # Create .env file in backend directory
   echo "CLOUDINARY_CLOUD_NAME=your_cloud_name" > backend/.env
   echo "CLOUDINARY_API_KEY=your_api_key" >> backend/.env
   echo "CLOUDINARY_API_SECRET=your_api_secret" >> backend/.env
   ```

2. **Run the Upload Script**
   ```bash
   cd backend
   python scripts/upload_images_to_cloudinary.py
   ```

3. **Verify Generated Files**
   - `cloudinary_image_mapping.json` - JSON mapping
   - `cloudinary_urls.py` - Python URLs list

### Production (On Render)

1. **SSH into Your Render Instance** (if available)
2. **Or use Render's Shell feature**
3. **Run the upload script**:
   ```bash
   cd /opt/render/project/src
   python scripts/upload_images_to_cloudinary.py
   ```

## 🌱 Step 4: Seed Your Database

### Option A: Use the Enhanced Seed Script

1. **Run the new seed script**:
   ```bash
   python scripts/reseed_with_cloudinary.py
   ```

### Option B: Use Your Existing Script

1. **Update your existing seed script** to import from the generated file:
   ```python
   from .cloudinary_urls import CLOUDINARY_IMAGE_URLS
   ```

## 🔍 Step 5: Verify Setup

1. **Check Your Backend Logs**
   - Look for successful image uploads
   - Verify no Cloudinary configuration errors

2. **Test Image Loading**
   - Make a request to your products endpoint
   - Verify images load from Cloudinary URLs

3. **Check Database**
   - Verify products have Cloudinary URLs
   - Ensure no local file paths remain

## 🚨 Troubleshooting

### Common Issues

1. **"Missing Cloudinary environment variables"**
   - Double-check your Render environment variables
   - Ensure they're exactly named as shown above

2. **"Authentication failed"**
   - Verify your API key and secret
   - Check if your Cloudinary account is active

3. **"Images not uploading"**
   - Check your internet connection
   - Verify image file permissions
   - Ensure images are valid formats

4. **"Database seeding fails"**
   - Check database connection
   - Verify table structure
   - Look for constraint violations

### Debug Commands

```bash
# Check environment variables
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY
echo $CLOUDINARY_API_SECRET

# Test Cloudinary connection
python -c "
import cloudinary
import os
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)
print('Cloudinary configured successfully')
"
```

## 📚 Additional Resources

- [Cloudinary Python SDK Documentation](https://cloudinary.com/documentation/python_integration)
- [Render Environment Variables Guide](https://render.com/docs/environment-variables)
- [Flask Environment Configuration](https://flask.palletsprojects.com/en/2.3.x/config/)

## 🎯 Next Steps

After completing this setup:

1. ✅ **Images will load from Cloudinary** instead of local files
2. ✅ **Your backend will work on Render** without image issues
3. ✅ **Database will have proper product data** with Cloudinary URLs
4. ✅ **Frontend will display images correctly** from your deployed backend

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review your Render service logs
3. Verify your Cloudinary credentials
4. Ensure all environment variables are set correctly

---

**Happy coding! 🚀**
