# Advanced script with configurable parameters

param(
    [switch]$Force,
    [string]$LogFile
)

# Function to write log messages
function Write-Log {
    param([string]$Message)
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    
    if ($LogFile) {
        Add-Content -Path $LogFile -Value $logMessage
    }
    
    Write-Host $Message
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Log "npm version: $npmVersion"
}
catch {
    Write-Log "ERROR: npm is not installed or not in PATH"
    exit 1
}

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Log "ERROR: package.json not found in current directory"
    exit 1
}

# Clear npm cache if force flag is set
if ($Force) {
    Write-Log "Clearing npm cache..."
    npm cache clean --force
}

Write-Log "Running npm install with options: --prefer-offline --no-audit --no-fund --legacy-peer-deps"

# Run npm install with all options
$result = npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps 2>&1

# Check the result
if ($LASTEXITCODE -eq 0) {
    Write-Log "SUCCESS: npm install completed successfully"
    
    # Optional: Show installed packages count
    $packages = Get-ChildItem "node_modules" -ErrorAction SilentlyContinue
    if ($packages) {
        Write-Log "Installed packages: $($packages.Count)"
    }
    
    exit 0
}
else {
    Write-Log "ERROR: npm install failed with exit code: $LASTEXITCODE"
    
    # Log the error output
    foreach ($line in $result) {
        Write-Log "  $line"
    }
    
    exit $LASTEXITCODE
}