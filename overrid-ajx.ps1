# Fix AJV Override Conflict
Write-Host "🔧 Fixing AJV Override Conflict" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend
$frontendPath = "C:\Users\user\Documents\Aleyo_Web_Builder_With_AI\frontend"
Set-Location $frontendPath
Write-Host "✅ In frontend directory" -ForegroundColor Green
Write-Host ""

# Kill Node processes
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "   ✓ Stopped Node processes"
Write-Host ""

# Backup package.json
if (Test-Path "package.json") {
    Copy-Item package.json package.json.backup
    Write-Host "✅ Backup created: package.json.backup" -ForegroundColor Green
}
Write-Host ""

# Remove node_modules and package-lock.json
Write-Host "🗑️  Removing old files..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Write-Host "   ✓ Removed node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    Write-Host "   ✓ Removed package-lock.json"
}
Write-Host ""

# Clear npm cache
Write-Host "🗑️  Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✅ Cache cleared" -ForegroundColor Green
Write-Host ""

# Create clean package.json without overrides
Write-Host "📝 Creating clean package.json..." -ForegroundColor Yellow

# Read current package.json and remove overrides
$packageJsonContent = Get-Content "package.json.backup" -Raw | ConvertFrom-Json

# Remove overrides and resolutions if they exist
if ($packageJsonContent.PSObject.Properties.Name -contains "overrides") {
    $packageJsonContent.PSObject.Properties.Remove("overrides")
    Write-Host "   ✓ Removed overrides section"
}
if ($packageJsonContent.PSObject.Properties.Name -contains "resolutions") {
    $packageJsonContent.PSObject.Properties.Remove("resolutions")
    Write-Host "   ✓ Removed resolutions section"
}

# Ensure ajv and ajv-keywords are in devDependencies with ^ versions
if (-not $packageJsonContent.devDependencies) {
    $packageJsonContent | Add-Member -MemberType NoteProperty -Name "devDependencies" -Value @{}
}
$packageJsonContent.devDependencies.ajv = "^6.12.6"
$packageJsonContent.devDependencies."ajv-keywords" = "^3.5.2"

# Save the cleaned package.json
$packageJsonContent | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding utf8
Write-Host "✅ Clean package.json created" -ForegroundColor Green
Write-Host ""

# Create .npmrc
Write-Host "📝 Creating .npmrc..." -ForegroundColor Yellow
$npmrcContent = @"
legacy-peer-deps=true
strict-peer-deps=false
package-lock=true
resolution-mode=highest
"@
$npmrcContent | Out-File -FilePath ".npmrc" -Encoding utf8
Write-Host "✅ .npmrc created" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Verify AJV installation
Write-Host "🔍 Verifying AJV installation..." -ForegroundColor Yellow
$ajvVersion = npm list ajv --depth=0 2>$null | Select-String "ajv@"
$ajvKeywordsVersion = npm list ajv-keywords --depth=0 2>$null | Select-String "ajv-keywords@"

if ($ajvVersion) {
    Write-Host "   ✅ $ajvVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ ajv not found" -ForegroundColor Red
}

if ($ajvKeywordsVersion) {
    Write-Host "   ✅ $ajvKeywordsVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ ajv-keywords not found" -ForegroundColor Red
}
Write-Host ""

# Test AJV
Write-Host "🧪 Testing AJV..." -ForegroundColor Yellow
$testScript = @"
try {
    const Ajv = require('ajv');
    const ajv = new Ajv();
    console.log('   AJV version:', Ajv.prototype.constructor.version);
    console.log('   ✅ AJV is working correctly');
    process.exit(0);
} catch(e) {
    console.log('   ❌ Error:', e.message);
    process.exit(1);
}
"@

node -e $testScript

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AJV test passed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  AJV test failed" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "🎉 Fix complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting React application..." -ForegroundColor Yellow
Write-Host ""

# Start the app
npm start