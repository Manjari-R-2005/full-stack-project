# Starts a user-level MongoDB daemon bound to 127.0.0.1:27017 with writable paths
$ErrorActionPreference = 'SilentlyContinue'

$mongod = "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
$dbPath = "C:\data\db"
$logDir = "C:\ProgramData\MongoDB\log"
$logPath = Join-Path $logDir "mongod-dev.log"

# Ensure folders exist
New-Item -ItemType Directory -Force -Path $dbPath | Out-Null
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

# Launch mongod detached if not already running
$existing = Get-Process -Name mongod -ErrorAction SilentlyContinue
if (-not $existing) {
    Start-Process -FilePath $mongod -ArgumentList @(
        "--dbpath", $dbPath,
        "--logpath", $logPath,
        "--bind_ip", "127.0.0.1",
        "--port", "27017",
        "--logappend"
    ) -WindowStyle Hidden
}
