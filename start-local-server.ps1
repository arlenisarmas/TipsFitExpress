$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot
$env:PORT = "5500"
node scripts\dev-server.mjs
