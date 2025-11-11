@echo off
echo 🚀 Starting PDF ^& Image Watermark Remover...
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo ❌ Error: Please run this script from the project root directory
    exit /b 1
)
if not exist "backend" (
    echo ❌ Error: Please run this script from the project root directory
    exit /b 1
)

echo 📦 Installing dependencies...
echo.

REM Frontend dependencies
echo 🎨 Frontend setup...
cd frontend
call npm install
cd ..

REM Backend dependencies
echo 🐍 Backend setup...
cd backend
pip install -r requirements.txt
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📖 Quick Start Guide:
echo.
echo 1️⃣  Start Backend:
echo    cd backend
echo    uvicorn app:app --reload --port 8000
echo.
echo 2️⃣  Start Frontend (in new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3️⃣  Open browser:
echo    http://localhost:5173
echo.
echo 🎨 Features available:
echo    ✅ Light/Dark theme toggle
echo    ✅ English/Sinhala language
echo    ✅ PDF watermark removal
echo    ⚠️  Image watermark removal (UI ready, backend pending)
echo.
echo 📚 Read IMPLEMENTATION_GUIDE.md for more details
echo.
pause
