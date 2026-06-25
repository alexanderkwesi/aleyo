# Fix Node.js PATH for Aleyo Website Builder
Write-Host "🔧 Fixing Node.js PATH - Aleyo Website Builder" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Common Node.js installation paths
$nodePaths = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs",
    "$env:AppData\nvm",
    "$env:LocalAppData\nvm",
    "$env:AppData\Programs\nodejs",
    "$env:LocalAppData\Programs\nodejs"
)

# Check if Node.js is installed in any of these locations
$nodeFound = $false
$foundPath = $null

Write-Host "🔍 Searching for Node.js installation..." -ForegroundColor Yellow
foreach ($path in $nodePaths) {
    $nodeExe = Join-Path $path "node.exe"
    if (Test-Path $nodeExe) {
        Write-Host "✅ Found Node.js at: $path" -ForegroundColor Green
        $nodeFound = $true
        $foundPath = $path
        break
    }
}

if (-not $nodeFound) {
    Write-Host "❌ Node.js not found in common locations!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📦 Installing Node.js 18.20.0..." -ForegroundColor Yellow
    Write-Host ""
    
    # Download Node.js installer
    $nodeInstaller = "$env:TEMP\node-v18.20.0-x64.msi"
    $nodeUrl = "https://nodejs.org/dist/v18.20.0/node-v18.20.0-x64.msi"
    
    Write-Host "Downloading Node.js installer..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller
    
    Write-Host "Running Node.js installer..." -ForegroundColor Yellow
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $nodeInstaller, "/quiet", "/norestart" -Wait
    
    Write-Host "✅ Node.js installed" -ForegroundColor Green
    Write-Host ""
    
    # Set the found path
    $foundPath = "C:\Program Files\nodejs"
    $nodeFound = $true
}

if ($nodeFound) {
    # Add to current session PATH
    Write-Host "📝 Adding Node.js to PATH..." -ForegroundColor Yellow
    $env:Path = "$foundPath;$env:Path"
    
    # Add to user PATH permanently
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$foundPath*") {
        $newPath = "$foundPath;$userPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "✅ Node.js added to user PATH permanently" -ForegroundColor Green
    } else {
        Write-Host "✅ Node.js already in PATH" -ForegroundColor Green
    }
    
    Write-Host ""
    
    # Verify Node.js
    Write-Host "🔍 Verifying Node.js installation..." -ForegroundColor Yellow
    $nodeVersion = & "$foundPath\node.exe" --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    
    $npmVersion = & "$foundPath\npm.cmd" --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Node.js PATH fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")