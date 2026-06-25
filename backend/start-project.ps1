# Aleyo Website Builder - Start Script
Write-Host "🚀 Starting Aleyo Website Builder..." -ForegroundColor Cyan
Write-Host ""

# Set Node.js path
$nodePath = "C:\Program Files\nodejs"
if (Test-Path $nodePath) {
    $env:Path = "$nodePath;$env:Path"
}

# Start Backend
Write-Host "🐍 Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\Activate.ps1; uvicorn app:app --reload --port 8000"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "⚛️  Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start"

Write-Host ""
Write-Host "✅ Servers running!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:8000"
Write-Host "   Frontend: http://localhost:3000"
Write-Host ""
Write-Host "Close windows to stop servers." -ForegroundColor Yellow
