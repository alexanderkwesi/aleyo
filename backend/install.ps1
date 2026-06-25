# Aleyo Website Builder - React Installation Script for Windows
# This script installs all React dependencies

param(
    [switch]$Clean = $false,
    [switch]$SkipTailwind = $false
)

Write-Host "🎨 Aleyo Website Builder - React Installation" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📌 Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "   Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "   Recommended version: 18.x or higher" -ForegroundColor Yellow
    exit 1
}
Write-Host "   Node.js version: $nodeVersion" -ForegroundColor Green

$npmVersion = npm --version
Write-Host "   npm version: $npmVersion" -ForegroundColor Green
Write-Host ""

# Check Node version
$nodeMajor = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
if ($nodeMajor -lt 18) {
    Write-Host "⚠️  Warning: Node.js version $nodeVersion detected" -ForegroundColor Yellow
    Write-Host "   Recommended version is 18.x or higher" -ForegroundColor Yellow
    Write-Host ""
}

# Clean installation if requested
if ($Clean) {
    Write-Host "🧹 Cleaning previous installation..." -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Write-Host "   Removing node_modules..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    }
    if (Test-Path "package-lock.json") {
        Write-Host "   Removing package-lock.json..." -ForegroundColor Yellow
        Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    }
    Write-Host "   Cleaning npm cache..." -ForegroundColor Yellow
    npm cache clean --force
    Write-Host "✅ Cleanup complete" -ForegroundColor Green
    Write-Host ""
}

# Install dependencies
Write-Host "📦 Installing React and dependencies..." -ForegroundColor Yellow
Write-Host "   This may take 3-5 minutes..." -ForegroundColor Yellow
Write-Host ""

npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Installation failed!" -ForegroundColor Red
    Write-Host "   Trying alternative installation method..." -ForegroundColor Yellow
    Write-Host ""
    
    # Install critical packages one by one
    $criticalPackages = @(
        "react@18.3.1",
        "react-dom@18.3.1",
        "react-scripts@5.0.1",
        "@mui/material@5.15.21",
        "@emotion/react@11.11.4",
        "@emotion/styled@11.11.5"
    )
    
    foreach ($package in $criticalPackages) {
        Write-Host "   Installing $package..." -ForegroundColor Yellow
        npm install $package --save --legacy-peer-deps
    }
    
    # Install remaining packages
    npm install --legacy-peer-deps
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Verify critical packages
Write-Host "🔍 Verifying critical packages..." -ForegroundColor Yellow
$criticalCheck = @(
    "react",
    "react-dom",
    "react-scripts",
    "@mui/material"
)

$allInstalled = $true
foreach ($pkg in $criticalCheck) {
    if (Test-Path "node_modules/$pkg") {
        $version = npm list $pkg --depth=0 2>$null | Select-String $pkg
        Write-Host "   ✅ $pkg installed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $pkg NOT installed" -ForegroundColor Red
        $allInstalled = $false
    }
}
Write-Host ""

if (-not $allInstalled) {
    Write-Host "⚠️  Some packages failed to install" -ForegroundColor Yellow
    Write-Host "   Attempting to fix..." -ForegroundColor Yellow
    Write-Host ""
    
    # Fix react-scripts specifically
    npm install react-scripts@5.0.1 --save --legacy-peer-deps
}

# Setup Tailwind CSS
if (-not $SkipTailwind) {
    Write-Host "🎨 Setting up Tailwind CSS..." -ForegroundColor Yellow
    if (Test-Path "src/index.css") {
        npx tailwindcss -i ./src/index.css -o ./src/tailwind.css --minify
        Write-Host "✅ Tailwind CSS configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  src/index.css not found, skipping Tailwind setup" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    @"
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
REACT_APP_ENABLE_VOICE=true
REACT_APP_ENABLE_AI=true
SKIP_PREFLIGHT_CHECK=true
DISABLE_ESLINT_PLUGIN=true
FAST_REFRESH=false
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host ""
}

# Create src directory structure if missing
Write-Host "📁 Creating directory structure..." -ForegroundColor Yellow
$directories = @(
    "src/components",
    "src/pages",
    "src/services",
    "src/hooks",
    "src/styles",
    "src/utils",
    "src/assets/images",
    "src/assets/fonts"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   Created: $dir"
    }
}
Write-Host "✅ Directory structure created" -ForegroundColor Green
Write-Host ""

# Installation complete
Write-Host "🎉 React installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Installation Summary:" -ForegroundColor Cyan
Write-Host "   Total packages: $(Get-ChildItem node_modules | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor White
Write-Host "   React version: $(npm list react --depth=0 2>$null | Select-String 'react@')" -ForegroundColor White
Write-Host "   React Scripts version: $(npm list react-scripts --depth=0 2>$null | Select-String 'react-scripts@')" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Start development server: npm start" -ForegroundColor White
Write-Host "   2. Run with backend: npm run dev:play-all" -ForegroundColor White
Write-Host "   3. Build for production: npm run build" -ForegroundColor White
Write-Host "   4. Run tests: npm test" -ForegroundColor White
Write-Host ""