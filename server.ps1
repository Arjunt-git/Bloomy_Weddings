# Starts the Bloomy server with its SQLite database and live-update API.
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCommand) {
    & $pythonCommand.Source "$PSScriptRoot\server.py"
    exit $LASTEXITCODE
}

$bundledPython = "C:\Users\arjun\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if (Test-Path $bundledPython) {
    & $bundledPython "$PSScriptRoot\server.py"
    exit $LASTEXITCODE
}

Write-Error "Python 3.11 or newer is required. Install Python, then run this file again."
