# Deployment Guide

## Prerequisites

- Git repository (GitHub recommended)
- Netlify account (for frontend)
- Render account (for backend)

---

## Frontend Deployment (Netlify)

### Option 1: GitHub Integration (Recommended)

1. **Push code to GitHub**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/watermark-remover.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Configure build settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`

3. **Add environment variables**:
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-api.onrender.com`

4. **Deploy**:
   - Netlify will automatically deploy on every push to main
   - Your site will be live at: `https://your-app.netlify.app`

### Option 2: Manual Deploy

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Build frontend
cd frontend
npm install
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

## Backend Deployment (Render)

### Deploy with GitHub Integration

1. **Push code to GitHub** (if not already done)

2. **Create Web Service on Render**:
   - Go to [Render](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `watermark-remover-api`
     - **Environment**: `Docker`
     - **Region**: Choose closest to your users
     - **Branch**: `main`
     - **Docker Context**: `./backend`
     - **Dockerfile Path**: `./backend/Dockerfile`

3. **Add environment variables**:
   - `ALLOWED_ORIGINS` = `https://your-app.netlify.app`
   - `PORT` = `8000` (Render will set this automatically)

4. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Your API will be live at: `https://your-api.onrender.com`

5. **Update frontend URL**:
   - Go back to Netlify
   - Update `VITE_API_URL` environment variable
   - Trigger a new deployment

### Alternative: Manual Docker Deploy

```powershell
# Build Docker image
cd backend
docker build -t watermark-remover-api .

# Test locally
docker run -p 8000:8000 -e ALLOWED_ORIGINS="*" watermark-remover-api

# Push to Docker Hub
docker tag watermark-remover-api yourusername/watermark-remover-api
docker push yourusername/watermark-remover-api
```

---

## Update netlify.toml

Before deploying, update the API redirect in `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-api.onrender.com/:splat"
  status = 200
  force = true
```

Replace `your-actual-api.onrender.com` with your Render service URL.

---

## Post-Deployment Checklist

### Frontend (Netlify)
- [ ] Site is accessible
- [ ] PDF upload works
- [ ] PDF viewer renders correctly
- [ ] Selection tool draws rectangles
- [ ] Language toggle works
- [ ] Privacy headers are set (check Network tab)

### Backend (Render)
- [ ] API is accessible
- [ ] Health check returns 200: `https://your-api.onrender.com/health`
- [ ] Swagger docs work: `https://your-api.onrender.com/docs`
- [ ] CORS allows frontend origin
- [ ] File upload size limit works
- [ ] PDF processing completes successfully

### Integration
- [ ] Frontend can call backend API
- [ ] PDF analysis returns response
- [ ] PDF cleaning downloads file
- [ ] Error messages display correctly
- [ ] No console errors

---

## Monitoring & Maintenance

### Netlify
- Check build logs: Site settings → Deploys → Deploy log
- Monitor bandwidth: Analytics tab
- Set up deploy notifications

### Render
- Check logs: Service → Logs tab
- Monitor usage: Metrics tab
- Set up health check alerts

### Performance
- Test with large PDFs (40-50MB)
- Check processing time
- Monitor memory usage
- Test concurrent requests

---

## Troubleshooting

### Frontend build fails
```powershell
# Clear cache and rebuild
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

### Backend doesn't start
```powershell
# Check Python dependencies
cd backend
pip install -r requirements.txt
python app.py
```

### CORS errors
- Verify `ALLOWED_ORIGINS` includes your Netlify URL
- Check `netlify.toml` has correct API URL
- Test with browser dev tools (Network tab)

### 413 Payload Too Large
- Increase Render plan if needed
- Add client-side file size check
- Compress PDFs before upload

---

## Scaling Considerations

### Free Tier Limits
- **Netlify**: 100GB bandwidth/month, 300 build minutes/month
- **Render**: 750 hours/month (free tier spins down after inactivity)

### Upgrade Path
- Netlify Pro: $19/month (better performance, more bandwidth)
- Render Starter: $7/month (always on, better resources)

### Optimization Tips
- Enable Netlify CDN caching for assets
- Use Render background workers for heavy processing
- Implement request queue for large files
- Add Redis for caching repeated operations

---

## Environment Variables Reference

### Frontend (Netlify)
```bash
VITE_API_URL=https://your-api.onrender.com
```

### Backend (Render)
```bash
ALLOWED_ORIGINS=https://your-app.netlify.app
PORT=8000  # Auto-set by Render
```

---

## Custom Domain (Optional)

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Configure DNS (add A/CNAME records)
4. Enable HTTPS (automatic with Let's Encrypt)

### Render
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS to point to Render
4. SSL is automatic

---

**Next Steps**: Test the deployed application thoroughly, then proceed with v2 features!
