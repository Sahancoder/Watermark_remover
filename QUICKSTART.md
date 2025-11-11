# Quick Start Guide

Get your PDF Watermark Remover up and running in 5 minutes!

## 📋 Prerequisites

1. **Node.js** 18 or higher - [Download](https://nodejs.org/)
2. **Python** 3.10 or higher - [Download](https://www.python.org/)
3. **PowerShell** (comes with Windows)

## 🚀 Local Development Setup

### Step 1: Install Backend Dependencies

Open PowerShell in the project root:

```powershell
cd "e:\My Projects\Watermark remover"

# Create Python virtual environment
cd backend
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Go back to root
cd ..
```

### Step 2: Install Frontend Dependencies

In the same PowerShell window:

```powershell
cd frontend
npm install
cd ..
```

### Step 3: Start Development Servers

You'll need **two PowerShell windows**:

**Terminal 1** (Backend):
```powershell
cd "e:\My Projects\Watermark remover"
.\scripts\dev-backend.ps1
```

**Terminal 2** (Frontend):
```powershell
cd "e:\My Projects\Watermark remover"
.\scripts\dev-frontend.ps1
```

### Step 4: Open the App

Open your browser and go to: **http://localhost:5173**

You should see the PDF Watermark Remover interface!

---

## 🧪 Testing the Application

1. **Upload a PDF**:
   - Drag and drop a PDF file onto the upload area
   - Or click "Select PDF File" to browse

2. **Select Watermark Area**:
   - Click and drag on the PDF to draw a rectangle around the watermark
   - Draw multiple selections if needed

3. **Choose Removal Method**:
   - Keep "Cover/Redact" selected (only method in v1)
   - Optionally change the cover color (default is white)

4. **Process and Download**:
   - Click "Clean & Download"
   - Wait for processing (a few seconds)
   - The cleaned PDF will download automatically

---

## 🔧 Troubleshooting

### Backend won't start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Frontend won't start

**Error**: `Cannot find module 'react'`

**Solution**:
```powershell
cd frontend
rm -rf node_modules
npm install
```

### CORS errors in browser console

**Solution**: Make sure both servers are running:
- Backend at http://localhost:8000
- Frontend at http://localhost:5173

### PDF won't upload

**Check**:
- File size < 50MB
- File is actually a PDF (not renamed)
- Backend terminal shows no errors

---

## 📁 Project Structure Quick Reference

```
watermark-remover/
├── backend/                 # FastAPI server
│   ├── app.py              # Main API (run this)
│   ├── redact.py           # PDF manipulation logic
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── services/      # API calls
│   │   └── App.tsx        # Main component
│   └── package.json       # Node dependencies
│
├── scripts/
│   ├── dev-backend.ps1    # Start backend
│   └── dev-frontend.ps1   # Start frontend
│
└── README.md              # Full documentation
```

---

## 🎯 What Works in v1

✅ PDF upload (drag & drop)  
✅ PDF viewer with page navigation  
✅ Manual watermark selection (draw rectangles)  
✅ Cover/redact with custom colors  
✅ Download cleaned PDF  
✅ English & Sinhala UI  
✅ Privacy-first (no file storage)  

## 🚧 Coming in v2

⏳ Auto-detect watermarks  
⏳ Native delete method  
⏳ Apply to all similar  
⏳ Logo detection  

---

## 📞 Getting Help

1. **Check the logs**:
   - Backend: Look at the PowerShell window running the backend
   - Frontend: Check browser console (F12)

2. **Read the docs**:
   - `README.md` - Full documentation
   - `ROADMAP.md` - Development plan
   - `DEPLOYMENT.md` - Deployment guide

3. **Common issues**:
   - Make sure Python 3.10+ is installed
   - Make sure Node.js 18+ is installed
   - Try closing and restarting both servers

---

## 🎉 Next Steps

Once everything works locally:

1. ✅ Test with different PDF files
2. ✅ Try multiple selections on one page
3. ✅ Test the language toggle (English ↔ Sinhala)
4. ✅ Experiment with different cover colors
5. 📖 Read `DEPLOYMENT.md` to deploy to production
6. 🛠️ Check `ROADMAP.md` for upcoming features

---

**Enjoy removing watermarks!** 🚀
