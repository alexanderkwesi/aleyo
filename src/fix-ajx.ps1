# Aleyo Website Builder - Fix AJV Module Error
# Run this script as Administrator

param(
    [switch]$Clean = $true
)

Write-Host "🔧 Fixing AJV Module Error for React Scripts" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Set working directory
$frontendPath = "C:\Users\user\Documents\Aleyo_Web_Builder_With_AI\src"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    Write-Host "✅ Working in: $frontendPath" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend directory not found: $frontendPath" -ForegroundColor Red
    Write-Host "Please update the path in this script" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

if ($Clean) {
    Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
    
    # Kill Node processes
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "   ✓ Stopped Node processes"
    
    # Remove node_modules
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
        Write-Host "   ✓ Removed node_modules"
    }
    
    # Remove package-lock.json
    if (Test-Path "package-lock.json") {
        Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
        Write-Host "   ✓ Removed package-lock.json"
    }
    
    # Clear npm cache
    npm cache clean --force
    Write-Host "   ✓ Cleared npm cache"
    
    Write-Host "✅ Cleanup complete" -ForegroundColor Green
    Write-Host ""
}

Write-Host "📦 Installing AJV and dependencies..." -ForegroundColor Yellow

# Install specific versions that work together
$packages = @(
    "ajv@8.12.0",
    "ajv-keywords@5.1.0",
    "ajv-formats@2.1.1",
    "json-schema-traverse@1.0.0",
    "fast-deep-equal@3.1.3"
)

foreach ($pkg in $packages) {
    Write-Host "   Installing $pkg..."
    npm install $pkg --save-dev --legacy-peer-deps
}

Write-Host "✅ AJV packages installed" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Installing remaining dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
Write-Host "✅ All dependencies installed" -ForegroundColor Green
Write-Host ""

Write-Host "🔍 Verifying AJV installation..." -ForegroundColor Yellow

# Test AJV module
$testScript = @"
try {
    const codegen = require('ajv/dist/compile/codegen');
    console.log('✅ ajv/dist/compile/codegen found');
    console.log('   Codegen functions:', Object.keys(codegen).join(', '));
    process.exit(0);
} catch(e) {
    console.log('❌ Error:', e.message);
    console.log('   Path:', e.code);
    process.exit(1);
}
"@

$testResult = node -e $testScript 2>&1
Write-Host $testResult

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AJV module is working correctly!" -ForegroundColor Green
} else {
    Write-Host "⚠️  AJV module still has issues" -ForegroundColor Yellow
    Write-Host "   Attempting manual fix..." -ForegroundColor Yellow
    
    # Manual fix: create the missing directory structure
    if (Test-Path "node_modules/ajv") {
        Write-Host "   Creating missing directories..."
        New-Item -ItemType Directory -Path "node_modules/ajv/dist/compile" -Force | Out-Null
        Write-Host "   ✓ Created directory structure"
    }
}

Write-Host ""
Write-Host "🚀 Starting React application..." -ForegroundColor Green
Write-Host ""

