Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking server.js for the fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$file = "server.js"

if (-not (Test-Path $file)) {
    Write-Host "ERROR: server.js not found" -ForegroundColor Red
    exit 1
}

Write-Host "✓ server.js found" -ForegroundColor Green
Write-Host ""

# Check for old code (without fix)
$content = Get-Content $file -Raw
if ($content -match "app\.get\('/'\,\s*isAuthenticated") {
    Write-Host "❌ OLD CODE FOUND - Fix NOT applied" -ForegroundColor Red
    Write-Host ""
    Write-Host "Found old code with isAuthenticated middleware"
    exit 1
}

# Check for new code (with fix)
if ($content -match "if \(req\.session\.userId\)") {
    Write-Host "✅ FIX IS APPLIED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Showing lines 242-249:" -ForegroundColor Yellow
    Get-Content $file | Select-Object -Skip 241 -First 8 | ForEach-Object { Write-Host $_ }
    Write-Host ""
    Write-Host "✓ Root route will redirect to /login for non-authenticated users" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "LOCAL FILES: Ready to upload to server" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    exit 0
}

Write-Host "⚠️  Cannot determine fix status" -ForegroundColor Yellow

