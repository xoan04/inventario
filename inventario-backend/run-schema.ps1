# Script para ejecutar schema.sql usando credenciales del archivo .env

# Cambiar al directorio del script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Buscar el archivo .env
$envPath = ".env"
if (-not (Test-Path $envPath)) {
    $envPath = "..\..env"
    if (-not (Test-Path $envPath)) {
        Write-Host "❌ Error: No se encontró el archivo .env" -ForegroundColor Red
        Write-Host "Por favor, crea un archivo .env basado en env.example" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "📄 Cargando variables de entorno desde: $envPath" -ForegroundColor Cyan

# Cargar variables del .env
Get-Content $envPath | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)\s*=\s*(.+)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        # Remover comillas si existen
        $value = $value -replace '^["'']|["'']$', ''
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

# Obtener variables de entorno
$DB_HOST = [Environment]::GetEnvironmentVariable("DB_HOST", "Process")
$DB_PORT = [Environment]::GetEnvironmentVariable("DB_PORT", "Process")
$DB_USER = [Environment]::GetEnvironmentVariable("DB_USER", "Process")
$DB_PASSWORD = [Environment]::GetEnvironmentVariable("DB_PASSWORD", "Process")
$DB_NAME = [Environment]::GetEnvironmentVariable("DB_NAME", "Process")

# Validar que todas las variables estén presentes
if (-not $DB_HOST) { $DB_HOST = "localhost" }
if (-not $DB_PORT) { $DB_PORT = "5432" }
if (-not $DB_USER) { $DB_USER = "postgres" }
if (-not $DB_NAME) { $DB_NAME = "inventario_db" }

if (-not $DB_PASSWORD) {
    Write-Host "❌ Error: DB_PASSWORD no está configurada en el archivo .env" -ForegroundColor Red
    exit 1
}

Write-Host "🔌 Conectando a PostgreSQL..." -ForegroundColor Cyan
Write-Host "   Host: $DB_HOST" -ForegroundColor Gray
Write-Host "   Puerto: $DB_PORT" -ForegroundColor Gray
Write-Host "   Usuario: $DB_USER" -ForegroundColor Gray
Write-Host "   Base de datos: $DB_NAME" -ForegroundColor Gray
Write-Host ""

# Ruta del archivo schema.sql
$schemaPath = Join-Path $scriptPath "database\schema.sql"

if (-not (Test-Path $schemaPath)) {
    Write-Host "❌ Error: No se encontró el archivo schema.sql en: $schemaPath" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Ejecutando schema.sql..." -ForegroundColor Cyan
Write-Host ""

# Configurar variable de entorno PGPASSWORD para psql
$env:PGPASSWORD = $DB_PASSWORD

# Ejecutar psql
$psqlCommand = "psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f `"$schemaPath`""

try {
    Invoke-Expression $psqlCommand
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Schema ejecutado correctamente!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Error al ejecutar el schema. Código de salida: $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error al ejecutar psql: $_" -ForegroundColor Red
    Write-Host "Asegúrate de tener PostgreSQL instalado y psql en tu PATH" -ForegroundColor Yellow
    exit 1
} finally {
    # Limpiar la variable de entorno de la contraseña
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
