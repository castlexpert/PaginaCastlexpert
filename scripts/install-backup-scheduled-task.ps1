$ErrorActionPreference = 'Stop'

param(
  [string]$TaskName = 'PaginaCastlexpert-GitHub-Backup',
  [ValidateSet('Hourly','Daily')]
  [string]$Schedule = 'Daily',
  [int]$EveryHours = 4,
  [string]$At = '19:00'
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$backupScript = (Resolve-Path (Join-Path $PSScriptRoot 'backup-to-github.ps1')).Path

if (-not (Test-Path $backupScript)) { throw "No existe: $backupScript" }
if (-not (Test-Path (Join-Path $repoRoot '.git'))) { throw "No es un repo Git: $repoRoot" }

$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$backupScript`""

if ($Schedule -eq 'Hourly') {
  if ($EveryHours -lt 1) { throw "EveryHours debe ser >= 1" }
  $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).Date.AddMinutes(2) -RepetitionInterval (New-TimeSpan -Hours $EveryHours) -RepetitionDuration ([TimeSpan]::MaxValue)
} else {
  $trigger = New-ScheduledTaskTrigger -Daily -At $At
}

$principal = New-ScheduledTaskPrincipal -UserId $env:UserName -LogonType S4U -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew

$task = New-ScheduledTask -Action $action -Trigger $trigger -Principal $principal -Settings $settings

Register-ScheduledTask -TaskName $TaskName -InputObject $task -Force | Out-Null

Write-Host "Tarea instalada: $TaskName"
Write-Host "Script: $backupScript"
Write-Host "Puedes probarla con: Start-ScheduledTask -TaskName `"$TaskName`""

