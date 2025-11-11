# PowerShell script to run backend development server
# Usage: .\scripts\dev-backend.ps1

Write-Host "Starting FastAPI backend development server..." -ForegroundColor Green

# Navigate to backend directory
Set-Location -Path "backend"

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Run the server
Write-Host "`nBackend server starting at http://localhost:8000" -ForegroundColor Cyan
Write-Host "API docs available at http://localhost:8000/docs`n" -ForegroundColor Cyan

python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
