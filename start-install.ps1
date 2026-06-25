# Aleyo Website Builder - Start All Services
Write-Host "🚀 Aleyo Website Builder - Starting All Services" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Get the current script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "📁 Current directory: $scriptPath" -ForegroundColor Gray
Write-Host ""

# Check Node.js and npm
Write-Host "🔍 Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed or not in PATH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js 18.20.0 using one of these methods:" -ForegroundColor Yellow
    Write-Host "  1. Install NVM: https://github.com/coreybutler/nvm-windows/releases" -ForegroundColor White
    Write-Host "  2. Then run: nvm install 18.20.0 && nvm use 18.20.0" -ForegroundColor White
    Write-Host "  3. Or download directly: https://nodejs.org/dist/v18.20.0/node-v18.20.0-x64.msi" -ForegroundColor White
    Write-Host ""
    Write-Host "After installing Node.js, restart PowerShell and run this script again." -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

$npmVersion = npm --version 2>$null
Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "🐍 Starting Python Backend..." -ForegroundColor Yellow

# Check if backend exists
$backendPath = Join-Path $scriptPath "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Backend directory not found: $backendPath" -ForegroundColor Red
    pause
    exit 1
}

# Check if virtual environment exists
$venvPath = Join-Path $backendPath "venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "📦 Virtual environment not found. Creating..." -ForegroundColor Yellow
    Set-Location $backendPath
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
}

# Install backend dependencies if needed
Write-Host "🔧 Checking backend dependencies..." -ForegroundColor Yellow
Set-Location $backendPath
& .\venv\Scripts\Activate.ps1

# Check if fastapi is installed
$fastapiCheck = python -c "import fastapi" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    pip install fastapi uvicorn[standard] websockets python-multipart pydantic python-jose[cryptography] passlib[bcrypt] bcrypt email-validator python-dotenv
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}

# Start backend in new window
Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
$backendProcess = Start-Process -NoNewWindow -PassThru -FilePath "cmd" -ArgumentList "/c", "cd /d $backendPath && .\venv\Scripts\activate && uvicorn app:app --reload --port 8000"
Write-Host "✅ Backend starting on http://localhost:8000" -ForegroundColor Green
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor Gray

# Wait for backend
Start-Sleep -Seconds 3
Write-Host ""

# Start Frontend
Write-Host "⚛️  Starting React Frontend..." -ForegroundColor Yellow

# Check if frontend exists
$frontendPath = Join-Path $scriptPath "src"
if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Frontend directory not found: $frontendPath" -ForegroundColor Red
    Write-Host "   Looking for frontend in: $frontendPath" -ForegroundColor Yellow
    pause
    exit 1
}

Set-Location $frontendPath
Write-Host "✅ Frontend directory: $frontendPath" -ForegroundColor Gray

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Write-Host "   This may take 3-5 minutes..." -ForegroundColor Gray
    npm install --legacy-peer-deps
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}

# Start frontend in new window
Write-Host "🚀 Starting React server..." -ForegroundColor Yellow
$frontendProcess = Start-Process -NoNewWindow -PassThru -FilePath "cmd" -ArgumentList "/c", "cd /d $frontendPath && npm start"
Write-Host "✅ Frontend starting on http://localhost:3000" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Both servers are running!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "   📍 Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "   📍 API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "   📍 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to stop all servers..." -ForegroundColor Yellow

# Wait for key press
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop processes
Write-Host ""
Write-Host "🛑 Stopping servers..." -ForegroundColor Yellow
try {
    $backendProcess.Kill()
    Write-Host "   ✓ Backend stopped"
} catch {
    Write-Host "   ⚠️  Backend already stopped"
}
try {
    $frontendProcess.Kill()
    Write-Host "   ✓ Frontend stopped"
} catch {
    Write-Host "   ⚠️  Frontend already stopped"
}
Write-Host "✅ All servers stopped" -ForegroundColor Green