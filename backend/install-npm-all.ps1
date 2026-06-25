# Universal npm Installer for All Node.js Versions
# Aleyo Website Builder - Complete npm Setup

param(
    [string]$NodeVersion = "18.20.0",
    [switch]$InstallAll = $false,
    [switch]$Force = $false
)

Write-Host "📦 Universal npm Installer - Aleyo Website Builder" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if running as Administrator
function Test-Admin {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Function to add to PATH
function Add-ToPath {
    param($Path)
    $env:Path = "$Path;$env:Path"
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$Path*") {
        $newPath = "$Path;$userPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "   ✅ Added to PATH: $Path" -ForegroundColor Green
    }
}

# ==================== Install/Update NVM ====================
Write-Host "🔧 Step 1: Setting up Node Version Manager (NVM)..." -ForegroundColor Yellow

# Check if NVM is installed
$nvmPath = (Get-Command nvm -ErrorAction SilentlyContinue).Source
if (-not $nvmPath -or $Force) {
    Write-Host "   📦 Installing NVM for Windows..." -ForegroundColor Gray
    
    $nvmUrl = "https://github.com/coreybutler/nvm-windows/releases/download/1.1.12/nvm-setup.exe"
    $nvmInstaller = "$env:TEMP\nvm-setup.exe"
    
    try {
        Invoke-WebRequest -Uri $nvmUrl -OutFile $nvmInstaller -UseBasicParsing
        Start-Process -FilePath $nvmInstaller -Wait -ArgumentList "/S"
        Write-Host "   ✅ NVM installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Failed to install NVM" -ForegroundColor Red
        Write-Host "   Please download manually: https://github.com/coreybutler/nvm-windows/releases" -ForegroundColor Yellow
    }
    
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "   ✅ NVM already installed" -ForegroundColor Green
    $nvmVersion = nvm version
    Write-Host "   Version: $nvmVersion" -ForegroundColor Gray
}
Write-Host ""

# ==================== Install Node.js Versions ====================
Write-Host "🔧 Step 2: Installing Node.js versions..." -ForegroundColor Yellow

# List of Node.js versions to install
$nodeVersions = @(
    "16.20.2",  # Node 16 (LTS)
    "18.20.0",  # Node 18 (LTS - Recommended)
    "20.11.0",  # Node 20 (Current LTS)
    "22.0.0"    # Node 22 (Latest)
)

if ($InstallAll) {
    Write-Host "   Installing ALL Node.js versions..." -ForegroundColor Gray
    $versionsToInstall = $nodeVersions
} else {
    Write-Host "   Installing recommended Node.js $NodeVersion..." -ForegroundColor Gray
    $versionsToInstall = @($NodeVersion)
}

foreach ($ver in $versionsToInstall) {
    Write-Host "   📦 Installing Node.js $ver..." -ForegroundColor Gray
    
    # Check if already installed
    $installed = nvm list | Select-String $ver
    if ($installed -and -not $Force) {
        Write-Host "      ✅ Already installed" -ForegroundColor Green
    } else {
        nvm install $ver
        if ($LASTEXITCODE -eq 0) {
            Write-Host "      ✅ Node.js $ver installed" -ForegroundColor Green
        } else {
            Write-Host "      ❌ Failed to install Node.js $ver" -ForegroundColor Red
        }
    }
}
Write-Host ""

# ==================== Switch to Recommended Version ====================
Write-Host "🔧 Step 3: Switching to Node.js $NodeVersion..." -ForegroundColor Yellow
nvm use $NodeVersion
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Using Node.js $NodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Failed to switch, trying to install first..." -ForegroundColor Yellow
    nvm install $NodeVersion
    nvm use $NodeVersion
}
Write-Host ""

# ==================== Verify Node.js and npm ====================
Write-Host "🔧 Step 4: Verifying installation..." -ForegroundColor Yellow

# Get actual Node.js path
$nodeActualPath = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $nodeActualPath) {
    # Try common paths
    $commonPaths = @(
        "C:\Program Files\nodejs\node.exe",
        "C:\Program Files (x86)\nodejs\node.exe",
        "$env:AppData\nvm\v$NodeVersion\node.exe",
        "$env:LocalAppData\nvm\v$NodeVersion\node.exe"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $nodeActualPath = $path
            break
        }
    }
}

if ($nodeActualPath) {
    $nodeDir = Split-Path $nodeActualPath
    Add-ToPath -Path $nodeDir
    $nodeVersion = & "$nodeActualPath" --version
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Node.js not found!" -ForegroundColor Red
}

# Check npm
$npmPath = (Get-Command npm -ErrorAction SilentlyContinue).Source
if (-not $npmPath) {
    $npmPath = Join-Path $nodeDir "npm.cmd"
}

if (Test-Path $npmPath) {
    $npmVersion = & "$npmPath" --version
    Write-Host "   ✅ npm: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  npm not found, installing npm..." -ForegroundColor Yellow
    # npm comes with Node.js, so reinstall Node.js
    nvm uninstall $NodeVersion
    nvm install $NodeVersion
    nvm use $NodeVersion
}
Write-Host ""

# ==================== Update npm to Latest ====================
Write-Host "🔧 Step 5: Updating npm to latest version..." -ForegroundColor Yellow
if ($npmPath) {
    & "$npmPath" install -g npm@latest
    $newNpmVersion = & "$npmPath" --version
    Write-Host "   ✅ npm updated to: $newNpmVersion" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Skipping npm update" -ForegroundColor Yellow
}
Write-Host ""

# ==================== Install Global Packages ====================
Write-Host "🔧 Step 6: Installing global npm packages..." -ForegroundColor Yellow

$globalPackages = @(
    "concurrently",
    "serve",
    "nodemon",
    "eslint",
    "prettier"
)

if ($npmPath) {
    foreach ($pkg in $globalPackages) {
        Write-Host "   📦 Installing $pkg..." -ForegroundColor Gray
        & "$npmPath" install -g $pkg
    }
    Write-Host "   ✅ Global packages installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Skipping global packages (npm not available)" -ForegroundColor Yellow
}
Write-Host ""

# ==================== Setup Project Dependencies ====================
Write-Host "🔧 Step 7: Setting up project dependencies..." -ForegroundColor Yellow

# Navigate to frontend directory
$frontendPath = Join-Path $PSScriptRoot "frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    Write-Host "   📁 Frontend directory: $frontendPath" -ForegroundColor Gray
    
    # Check if package.json exists
    if (-not (Test-Path "package.json")) {
        Write-Host "   📝 Creating package.json..." -ForegroundColor Gray
        $packageJson = @'
{
  "name": "aleyo-website-builder",
  "version": "1.0.0",
  "private": true,
  "description": "AI-powered website builder",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "5.0.1",
    "@mui/material": "^5.15.21",
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "react-router-dom": "^6.24.0",
    "axios": "^1.7.2",
    "framer-motion": "^11.2.12",
    "concurrently": "^8.2.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "dev": "concurrently \"npm start\" \"cd ../backend && uvicorn app:app --reload --port 8000\""
  },
  "proxy": "http://localhost:8000"
}
'@
        $packageJson | Out-File -FilePath "package.json" -Encoding utf8
        Write-Host "   ✅ package.json created" -ForegroundColor Green
    }
    
    # Install dependencies
    if (-not (Test-Path "node_modules") -or $Force) {
        Write-Host "   📦 Installing project dependencies..." -ForegroundColor Gray
        Write-Host "      This may take 3-5 minutes..." -ForegroundColor Gray
        
        if ($npmPath) {
            & "$npmPath" install --legacy-peer-deps
        } else {
            npm install --legacy-peer-deps
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Some dependencies may have issues" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ✅ Dependencies already installed" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠️  Frontend directory not found" -ForegroundColor Yellow
}
Write-Host ""

# ==================== Create Start Script ====================
Write-Host "🔧 Step 8: Creating start scripts..." -ForegroundColor Yellow

$startScriptContent = @'
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
'@

$startScriptPath = Join-Path $PSScriptRoot "start-project.ps1"
$startScriptContent | Out-File -FilePath $startScriptPath -Encoding utf8
Write-Host "   ✅ Created: start-project.ps1" -ForegroundColor Green

# ==================== Summary ====================
Write-Host ""
Write-Host "🎉 npm Installation Complete!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Installation Summary:" -ForegroundColor Cyan
Write-Host "   Node.js versions installed:" -ForegroundColor White
Write-Host "   $(nvm list)"
Write-Host ""
Write-Host "   Current Node.js: $(node --version 2>$null)" -ForegroundColor White
Write-Host "   Current npm: $(npm --version 2>$null)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Start the project: .\start-project.ps1" -ForegroundColor White
Write-Host "   2. Or start manually:" -ForegroundColor White
Write-Host "      Backend: cd backend && .\venv\Scripts\Activate.ps1 && uvicorn app:app --reload" -ForegroundColor Gray
Write-Host "      Frontend: cd frontend && npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   - Switch Node versions: nvm use 18.20.0" -ForegroundColor White
Write-Host "   - List installed versions: nvm list" -ForegroundColor White
Write-Host "   - Update npm: npm install -g npm@latest" -ForegroundColor White
Write-Host ""