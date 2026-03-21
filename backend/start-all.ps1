$shellPath = (Get-Command pwsh -ErrorAction SilentlyContinue).Source
if (-not $shellPath) { $shellPath = (Get-Command powershell).Source }

$npmPath = (Get-Command npm.cmd -ErrorAction SilentlyContinue).Source
if (-not $npmPath) { $npmPath = (Get-Command npm -ErrorAction SilentlyContinue).Source }

if (-not $npmPath) {
    Write-Error "CRITICAL: npm not found in System Path. Please install Node.js."
    exit
}

$root = Get-Location
$services = @(
    @{ Name = "API Gateway"; Path = "api-gateway"; Command = "run local" },
    @{ Name = "Frontend"; Path = "frontend"; Command = "run dev" },
    @{ Name = "Art Service"; Path = "services\art-service"; Command = "run local" },
    @{ Name = "Chat Service"; Path = "services\chat-service"; Command = "run dev" },
    @{ Name = "Elastic Search Service"; Path = "services\elastic-search-service"; Command = "run dev" },
    @{ Name = "Notification Service"; Path = "services\notification-service"; Command = "run local" },
    @{ Name = "S3 Service"; Path = "services\s3-service"; Command = "run dev" },
    @{ Name = "User Admin Service"; Path = "services\user-admin-service"; Command = "run local" },
    @{ Name = "Wallet Service"; Path = "services\wallet-service"; Command = "run local" }
)

$allCommands = @()

foreach ($service in $services) {
    $fullPath = Join-Path $root $service.Path
    if (Test-Path $fullPath) {
        $action = "`"$npmPath`" $($service.Command)"
        $tabCmd = "new-tab -d `"$fullPath`" --title `"$($service.Name)`" `"$shellPath`" -NoExit -Command `"$action`""
        $allCommands += $tabCmd
    }
}

$finalArgs = $allCommands -join " ; "

if ($finalArgs) {
    Write-Host "🚀 Launching ArtChain Services using $shellPath..." -ForegroundColor Cyan
    Start-Process wt -ArgumentList $finalArgs
} else {
    Write-Error "No service folders found in $root"
}