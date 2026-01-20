# run-tests.ps1
# Cost Manager - interactive test runner (PowerShell)
# Works with: Users / Costs / Logs / Admin services on Render

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ========= CONFIG =========
$USERS_BASE = "https://cost-manager-users-9kun.onrender.com"
$COSTS_BASE = "https://cost-manager-costs-4b42.onrender.com"
$LOGS_BASE  = "https://cost-manager-logs-1q12.onrender.com"
$ADMIN_BASE = "https://cost-manager-admin-ix1s.onrender.com"

# User used by submission guideline
$DEFAULT_USER_ID = 123123

# ========= HELPERS =========
function Print-Title([string]$t) {
  Write-Host ""
  Write-Host "========================================" -ForegroundColor Cyan
  Write-Host $t -ForegroundColor Cyan
  Write-Host "========================================" -ForegroundColor Cyan
}

function Safe-Json([object]$obj, [int]$depth = 20) {
  return ($obj | ConvertTo-Json -Depth $depth)
}

function Invoke-JsonGet([string]$url) {
  Write-Host "GET  $url" -ForegroundColor DarkGray
  $res = Invoke-RestMethod -Method Get -Uri $url
  $res
}

function Invoke-JsonPost([string]$url, [hashtable]$body) {
  Write-Host "POST $url" -ForegroundColor DarkGray
  Write-Host ("Body: " + (Safe-Json $body)) -ForegroundColor DarkGray
  $json = ($body | ConvertTo-Json -Compress)
  $res = Invoke-RestMethod -Method Post -ContentType "application/json" -Body $json -Uri $url
  $res
}

function Invoke-ExpectError([scriptblock]$action) {
  try {
    & $action | Out-Null
    Write-Host "Expected an error, but request succeeded ❌" -ForegroundColor Red
  } catch {
    # Try to read JSON error body (id/message)
    $status = $null
    try { $status = $_.Exception.Response.StatusCode.value__ } catch {}
    $bodyText = $null
    try {
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $bodyText = $reader.ReadToEnd()
    } catch {}
    Write-Host "Got error as expected ✅" -ForegroundColor Green
    if ($status -ne $null) { Write-Host "HTTP Status: $status" -ForegroundColor Yellow }
    if ($bodyText) { Write-Host "Body: $bodyText" -ForegroundColor Yellow }
    else { Write-Host $_.Exception.Message -ForegroundColor Yellow }
  }
}

# ========= TESTS =========
function Test-HealthAll {
  Print-Title "1) HEALTH - all services"
  Write-Host (Invoke-JsonGet "$USERS_BASE/health" | Out-String)
  Write-Host (Invoke-JsonGet "$COSTS_BASE/health" | Out-String)
  Write-Host (Invoke-JsonGet "$LOGS_BASE/health"  | Out-String)
  Write-Host (Invoke-JsonGet "$ADMIN_BASE/health" | Out-String)
}

function Test-About {
  Print-Title "2) ABOUT - developers team"
  $res = Invoke-JsonGet "$ADMIN_BASE/api/about"
  Write-Host (Safe-Json $res 10)
}

function Test-UsersList {
  Print-Title "3) USERS - list all"
  $res = Invoke-JsonGet "$USERS_BASE/api/users"
  Write-Host (Safe-Json $res 10)
}

function Test-UserDetails {
  Print-Title "4) USERS - details by id"
  $res = Invoke-JsonGet "$USERS_BASE/api/users/$DEFAULT_USER_ID"
  Write-Host (Safe-Json $res 10)
}

function Test-AddUser {
  Print-Title "5) USERS - add user (POST /api/add)"
  $newId = Get-Random -Minimum 200000 -Maximum 999999
  $body = @{
    id = $newId
    first_name = "test"
    last_name = "user"
    birthday = "1990-01-01"
  }
  $res = Invoke-JsonPost "$USERS_BASE/api/add" $body
  Write-Host (Safe-Json $res 10)
}

function Test-AddCost {
  Print-Title "6) COSTS - add cost (POST /api/add)"
  $body = @{
    description = "milk 9"
    category = "food"
    userid = $DEFAULT_USER_ID
    sum = 8
  }
  $res = Invoke-JsonPost "$COSTS_BASE/api/add" $body
  Write-Host (Safe-Json $res 10)
}

function Test-AddCostFuture {
  Print-Title "7) COSTS - add FUTURE cost (allowed)"
  $future = (Get-Date).ToUniversalTime().AddDays(7).ToString("yyyy-MM-ddTHH:mm:ssZ")
  $body = @{
    description = "future item"
    category = "food"
    userid = $DEFAULT_USER_ID
    sum = 99
    date = $future
  }
  $res = Invoke-JsonPost "$COSTS_BASE/api/add" $body
  Write-Host (Safe-Json $res 10)
}

function Test-AddCostPastShouldFail {
  Print-Title "8) COSTS - add PAST cost (should fail 400)"
  $body = @{
    description = "past item"
    category = "food"
    userid = $DEFAULT_USER_ID
    sum = 9
    date = "2020-01-01T10:00:00Z"
  }
  Invoke-ExpectError { Invoke-JsonPost "$COSTS_BASE/api/add" $body }
}

function Test-AddCostBadCategoryShouldFail {
  Print-Title "9) COSTS - invalid category (should fail 400)"
  $body = @{
    description = "bad cat"
    category = "car"
    userid = $DEFAULT_USER_ID
    sum = 1
  }
  Invoke-ExpectError { Invoke-JsonPost "$COSTS_BASE/api/add" $body }
}

function Test-ReportThisMonth {
  Print-Title "10) COSTS - monthly report"
  $year = (Get-Date).Year
  $month = (Get-Date).Month
  $url = "$COSTS_BASE/api/report?id=$DEFAULT_USER_ID&year=$year&month=$month"
  $res = Invoke-JsonGet $url
  Write-Host (Safe-Json $res 20)
}

function Test-Logs {
  Print-Title "11) LOGS - list"
  $res = Invoke-JsonGet "$LOGS_BASE/api/logs"
  Write-Host (Safe-Json $res 20)
}

function Test-AllMainFlow {
  Print-Title "12) FULL FLOW (health -> about -> users -> add cost -> report -> logs)"
  Test-HealthAll
  Test-About
  Test-UsersList
  Test-UserDetails
  Test-AddCost
  Test-ReportThisMonth
  Test-Logs
}

# ========= MENU =========
function Show-Menu {
  Write-Host ""
  Write-Host "Cost Manager - Test Menu" -ForegroundColor Cyan
  Write-Host "1  Health (all services)"
  Write-Host "2  About (developers)"
  Write-Host "3  Users list"
  Write-Host "4  User details (id=$DEFAULT_USER_ID)"
  Write-Host "5  Add user (creates a random test user)"
  Write-Host "6  Add cost (adds a small food cost)"
  Write-Host "7  Add FUTURE cost (allowed)"
  Write-Host "8  Add PAST cost (should FAIL)"
  Write-Host "9  Add cost with invalid category (should FAIL)"
  Write-Host "10 Report (current month)"
  Write-Host "11 Logs list"
  Write-Host "12 Full flow (recommended for video)"
  Write-Host "0  Exit"
  Write-Host ""
}

while ($true) {
  Show-Menu
  $choice = Read-Host "Choose a number"
  switch ($choice) {
    "1"  { Test-HealthAll }
    "2"  { Test-About }
    "3"  { Test-UsersList }
    "4"  { Test-UserDetails }
    "5"  { Test-AddUser }
    "6"  { Test-AddCost }
    "7"  { Test-AddCostFuture }
    "8"  { Test-AddCostPastShouldFail }
    "9"  { Test-AddCostBadCategoryShouldFail }
    "10" { Test-ReportThisMonth }
    "11" { Test-Logs }
    "12" { Test-AllMainFlow }
    "0"  { break }
    default { Write-Host "Invalid option. Try again." -ForegroundColor Yellow }
  }
}
