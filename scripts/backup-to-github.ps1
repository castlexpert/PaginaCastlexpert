$ErrorActionPreference = 'Stop'

function Write-Info([string]$Message) {
  $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  Write-Host "[$ts] $Message"
}

try {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
  Set-Location $RepoRoot

  if (-not (Test-Path (Join-Path $RepoRoot '.git'))) {
    throw "No es un repo Git: $RepoRoot"
  }

  $branch = (& git rev-parse --abbrev-ref HEAD).Trim()
  if (-not $branch) { throw "No se pudo detectar la rama actual." }

  Write-Info "Repo: $RepoRoot"
  Write-Info "Rama: $branch"

  # 1) Stage de todo lo trackeable (respeta .gitignore)
  & git add -A | Out-Null

  # 2) Si no hay cambios, salir limpio
  $porcelain = (& git status --porcelain).Trim()
  if (-not $porcelain) {
    Write-Info "Sin cambios. Nada que respaldar."
    exit 0
  }

  # 3) Commit con timestamp
  $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
  $msg = "backup: $stamp"
  Write-Info "Commit: $msg"
  & git commit -m $msg | Out-Null

  # 4) Rebase contra remoto (evita rechazos por historial)
  Write-Info "Actualizando desde origin/$branch (pull --rebase)..."
  & git pull --rebase origin $branch | Out-Null

  # 5) Push
  Write-Info "Subiendo a origin/$branch..."
  & git push origin $branch | Out-Null

  Write-Info "Respaldo completado."
  exit 0
} catch {
  Write-Host $_.Exception.Message
  exit 1
}

