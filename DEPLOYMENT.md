# 🚀 Deployment Guide - AI Grammar Fixer

This guide covers deploying both frontend and backend together (monorepo) or separately.

## 🎯 **Option 1: Monorepo Deployment (Recommended)**

Deploy both frontend and backend as a single Vercel project.

### **Step 1: Prepare Your Repository**
- Ensure you have the root `vercel.json` file
- Both `frontend/` and `backend/` folders are in the same repository
- Frontend `.env` file has `VITE_API_URL=` (empty for same domain)

### **Step 2: Deploy to Vercel**
1. **Go to Vercel Dashboard** → New Project
2. **Import your repository** (select the root folder)
3. **Configure build settings**:
   - Framework Preset: Other
   - Root Directory: `.` (root)
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install && cd ../backend && npm install`
4. **Deploy**

### **Step 3: Verify Deployment**
- Frontend: `https://your-project.vercel.app`
- Backend API: `https://your-project.vercel.app/check`
- Both share the same domain!

## 🔄 **Option 2: Separate Deployments**

Deploy frontend and backend as separate Vercel projects.

### **Backend Deployment**
1. **Create new Vercel project** for backend
2. **Select backend folder** as root
3. **Use existing backend/vercel.json**
4. **Deploy and note the URL**

### **Frontend Deployment**
1. **Update frontend/.env**:
   ```bash
   VITE_API_URL=https://your-backend-project.vercel.app
   ```
2. **Deploy frontend** to Vercel
3. **Both will work independently**

## 🛠️ **Alternative Platforms**

### **Railway (Recommended Alternative)**
```bash
# Deploy backend
cd backend
railway init
railway up

# Deploy frontend (separate project)
cd ../frontend
railway init
railway up
```

### **Render**
- **Backend**: Web Service with Node.js
- **Frontend**: Static Site
- Both can be in same account

### **Netlify + Vercel**
- **Frontend**: Netlify (great for React apps)
- **Backend**: Vercel (excellent for serverless)
- Cross-platform deployment

## 📋 **Deployment Checklist**

### **Monorepo Deployment**
- [ ] Root `vercel.json` exists
- [ ] Frontend `.env` has empty `VITE_API_URL`
- [ ] Both folders in same repository
- [ ] Build commands configured correctly
- [ ] Routes properly mapped

### **Separate Deployment**
- [ ] Backend deployed and accessible
- [ ] Frontend `.env` points to backend URL
- [ ] CORS configured correctly
- [ ] Both projects working independently

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   ```bash
   # Check build logs
   # Verify all dependencies are installed
   # Ensure correct Node.js version
   ```

2. **API Not Found**
   ```bash
   # Verify routes in vercel.json
   # Check API endpoint paths
   # Test backend independently
   ```

3. **CORS Errors**
   ```bash
   # Backend has CORS configured
   # Frontend URL matches backend CORS settings
   # Check browser console for errors
   ```

### **Testing Your Deployment**

1. **Test Backend API**:
   ```bash
   curl -X POST https://your-project.vercel.app/check \
     -H "Content-Type: application/json" \
     -d '{"text":"Hello world"}'
   ```

2. **Test Frontend**:
   - Open your deployed frontend
   - Try the grammar checker
   - Check browser network tab for API calls

## 🌐 **Environment Variables**

### **Frontend (.env)**
```bash
# For monorepo (same domain)
VITE_API_URL=

# For separate deployments
VITE_API_URL=https://your-backend.vercel.app

# For local development
VITE_API_URL=http://localhost:3001
```

### **Backend (No env vars needed)**
- LanguageTool API is public
- No sensitive data required
- CORS configured for all origins

## 📊 **Performance & Scaling**

### **Vercel Limits**
- **Function Timeout**: 30 seconds
- **Request Size**: 10MB
- **Concurrent Functions**: Auto-scaling
- **Cold Start**: ~100-200ms

### **Optimization Tips**
- Use text chunking for large documents
- Implement proper error handling
- Cache responses when possible
- Monitor function execution times

## 🎉 **Success Indicators**

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Grammar checker accepts text input
- ✅ API calls return successful responses
- ✅ Corrected text displays properly
- ✅ No CORS or network errors in console

## 🆘 **Getting Help**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify API endpoints are accessible
3. Test with simple curl commands
4. Check browser developer tools
5. Review this deployment guide

---

**Happy Deploying! 🚀**
