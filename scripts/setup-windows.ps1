# Helper script to prepare a Windows dev environment for hardFork
# Run as: PowerShell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1

function Command-Exists {
    param([string]$cmd)
    $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

Write-Host "Starting hardFork Windows setup..." -ForegroundColor Cyan

# 1) Check Node
if (-not (Command-Exists node)) {
    Write-Warning "Node.js not found. Attempting to install via winget (requires Windows 10/11)."
    if (Command-Exists winget) {
        winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
    } elseif (Command-Exists choco) {
        choco install nodejs-lts -y
    } else {
        Write-Error "Neither winget nor choco available. Please install Node.js manually from https://nodejs.org/ and rerun this script."
        exit 1
    }
} else {
    Write-Host "Node detected:" (node --version)
}

# 2) Ensure npm exists
if (-not (Command-Exists npm)) {
    Write-Error "npm not available after Node installation. Please verify Node.js installation."
    exit 1
}

# 3) Install Clarinet
if (-not (Command-Exists clarinet)) {
    Write-Host "Installing Clarinet globally via npm..." -ForegroundColor Yellow
    npm install --global @hirosystems/clarinet
    if (-not (Command-Exists clarinet)) {
        Write-Error "Clarinet installation failed or not in PATH. Try closing and reopening your terminal, or install manually: npm install --global @hirosystems/clarinet"
        exit 1
    }
} else {
    Write-Host "Clarinet detected:" (clarinet --version)
}

# 4) Create .env.template if missing
$envPath = Join-Path -Path (Get-Location) -ChildPath ".env.template"
if (-not (Test-Path $envPath)) {
    @"
# Environment template for hardFork
# Copy to .env and fill values
STACKS_API_URL=http://localhost:3999
BITCOIN_API_URL=http://localhost:18332
MNEMONIC=your-12-word-seed-phrase-here
NETWORK=devnet  # or testnet, mainnet
DEPLOYMENT_ACCOUNT=ST1234567890
"@ | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "Created .env.template at $envPath"
} else {
    Write-Host ".env.template already exists." -ForegroundColor Green
}

Write-Host "Setup complete. Next steps:" -ForegroundColor Cyan
Write-Host "  1) Open your browser and install the Stacks Wallet extension: https://www.stacks.co/explore/discover-stacks-apps/stacks-wallet"
Write-Host "  2) Copy .env.template to .env and fill in values."
Write-Host "  3) Start Clarinet local devnet: clarinet integrate"
Write-Host "  4) Run tests: npm run test"

Write-Host "If you need manual instructions, see docs/DEV_SETUP.md" -ForegroundColor Cyan
