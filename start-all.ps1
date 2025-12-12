$root = Get-Location
$services = @(
    @{ Name = "API Gateway"; Path = "api-gateway"; Command = "npm run local" },
    @{ Name = "Frontend"; Path = "frontend"; Command = "npm run dev" },
    @{ Name = "Art Service"; Path = "services\art-service"; Command = "npm run local" },
    @{ Name = "Chat Service"; Path = "services\chat-service"; Command = "npm run dev" },
    @{ Name = "Elastic Search Service"; Path = "services\elastic-search-service"; Command = "npm run dev" },
    @{ Name = "Notification Service"; Path = "services\notification-service"; Command = "npm run dev" },
    @{ Name = "S3 Service"; Path = "services\s3-service"; Command = "npm run dev" },
    @{ Name = "User Admin Service"; Path = "services\user-admin-service"; Command = "npm run local" },
    @{ Name = "Wallet Service"; Path = "services\wallet-service"; Command = "npm run local" }
)

$wtArgs = @()

foreach ($service in $services) {
    $path = Join-Path $root $service.Path
    $wtArgs += "nt -d `"$path`" --title `"$($service.Name)`" powershell -NoExit -Command `"$($service.Command)`""
}

$argumentList = $wtArgs -join " ; "

Start-Process wt -ArgumentList $argumentList
