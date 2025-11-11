# PowerShell script to run frontend development server
# Usage: .\scripts\dev-frontend.ps1

Write-Host "Starting React frontend development server..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location -Path "frontend"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Run the development server
Write-Host "`nFrontend server starting at http://localhost:5173`n" -ForegroundColor Cyan

npm run dev
