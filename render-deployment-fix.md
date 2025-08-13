# Render Deployment Troubleshooting Guide

## 🚨 Deployment Failed - Exit Status 1

### **Step 1: Check Detailed Logs**

1. Go to your Render dashboard
2. Navigate to your backend service
3. Click **"Logs"** tab
4. Look for the specific error message

### **Step 2: Common Issues & Solutions**

#### **Issue 1: Missing Dependencies**
**Error:** `ModuleNotFoundError: No module named 'flask'`
**Solution:**
```bash
# Check if requirements.txt exists and has all dependencies
# Make sure these are in your requirements.txt:
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-CORS==4.0.0
Flask-JWT-Extended==4.5.3
psycopg2-binary==2.9.7
python-dotenv==1.0.0
```

#### **Issue 2: Database Connection Error**
**Error:** `connection to server failed`
**Solution:**
- Verify `DATABASE_URL` environment variable is set correctly
- Check if database is accessible from Render
- Ensure database credentials are correct

#### **Issue 3: Port Configuration**
**Error:** `Address already in use`
**Solution:**
- Make sure your app uses `os.environ.get('PORT', 5000)`
- Render automatically sets the PORT environment variable

#### **Issue 4: Import Errors**
**Error:** `ImportError: cannot import name 'X'`
**Solution:**
- Check all import statements in your code
- Ensure all required modules are in requirements.txt
- Verify file paths are correct

#### **Issue 5: Environment Variables**
**Error:** `KeyError: 'DATABASE_URL'`
**Solution:**
- Verify all environment variables are set in Render dashboard
- Check for typos in variable names
- Ensure variables are set for the correct environment

### **Step 3: Quick Fixes to Try**

#### **Fix 1: Update requirements.txt**
Make sure your `requirements.txt` has all necessary dependencies:

```txt
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-CORS==4.0.0
Flask-JWT-Extended==4.5.3
Flask-Migrate==4.0.5
psycopg2-binary==2.9.7
python-dotenv==1.0.0
Werkzeug==2.3.7
gunicorn==21.2.0
```

#### **Fix 2: Check Entry Point**
Ensure your `run.py` or main file is correctly configured:

```python
if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=False  # Set to False for production
    )
```

#### **Fix 3: Verify Build Command**
In Render dashboard, check:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `python run.py` or `gunicorn run:app`

### **Step 4: Debug Steps**

#### **Step 4.1: Test Locally First**
```bash
# Test your app locally with production settings
export FLASK_ENV=production
export DATABASE_URL=your_database_url
python run.py
```

#### **Step 4.2: Check File Structure**
Ensure your project structure is correct:
```
backend/
├── run.py
├── requirements.txt
├── app_factory.py
├── models.py
├── routes/
└── config.py
```

#### **Step 4.3: Verify Environment Variables**
Double-check all environment variables in Render:
- `DATABASE_URL`
- `SECRET_KEY`
- `JWT_SECRET_KEY`
- `DEFAULT_ADMIN_USERNAME`
- `DEFAULT_ADMIN_PASSWORD`
- `CORS_ORIGINS`
- `FLASK_ENV=production`

### **Step 5: Redeploy After Fixes**

1. **Make necessary changes**
2. **Commit and push to your repository**
3. **Go to Render dashboard**
4. **Click "Manual Deploy"**
5. **Select "Deploy latest commit"**
6. **Monitor the logs for success**

### **Step 6: Success Indicators**

Look for these messages in successful deployment logs:
```
✅ Database connection successful
✅ Database tables created/verified successfully
✅ Default admin user created
   Username: admin
   Password: WegaAdmin2024!
```

## 🆘 Still Having Issues?

If the deployment still fails:

1. **Share the detailed error logs** from Render
2. **Check if your code runs locally** with production settings
3. **Verify all environment variables** are set correctly
4. **Ensure your database is accessible** from Render's servers

---

**Last Updated**: December 2024
