# PowerShell script to build both frontend and backend
# Usage: .\scripts\build.ps1

Write-Host "Building Watermark Remover application..." -ForegroundColor Green

# Build Frontend
Write-Host "`n=== Building Frontend ===" -ForegroundColor Cyan
Set-Location -Path "frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Building React app..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend build successful!" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend build failed!" -ForegroundColor Red
    exit 1
}

# Build Backend (test)
Write-Host "`n=== Checking Backend ===" -ForegroundColor Cyan
Set-Location -Path "..\backend"

if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "Testing imports..." -ForegroundColor Yellow
python -c "import app; import redact; print('✓ All imports successful')"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend check successful!" -ForegroundColor Green
} else {
    Write-Host "✗ Backend check failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Build Complete ===" -ForegroundColor Green
Write-Host "Frontend build: frontend/dist" -ForegroundColor Cyan
Write-Host "Backend ready: backend/" -ForegroundColor Cyan
