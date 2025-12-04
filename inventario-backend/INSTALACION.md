# Guía de Instalación Paso a Paso - Windows

Esta guía te ayudará a configurar el proyecto de gestión de inventario desde cero en Windows.

## Paso 1: Instalar Go

1. Descarga Go desde: https://golang.org/dl/
2. Ejecuta el instalador y sigue las instrucciones
3. Verifica la instalación abriendo PowerShell y ejecutando:
   ```powershell
   go version
   ```

## Paso 2: Instalar PostgreSQL

1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. Durante la instalación:
   - Anota la contraseña que configures para el usuario `postgres`
   - Acepta el puerto por defecto (5432)
   - Acepta la instalación de pgAdmin (opcional pero recomendado)

## Paso 3: Crear la Base de Datos

1. Abre **pgAdmin** (o usa la línea de comandos)
2. Conéctate al servidor PostgreSQL (usuario: `postgres`, contraseña: la que configuraste)
3. Crea una nueva base de datos llamada `inventario_db`:
   - Click derecho en "Databases" → "Create" → "Database"
   - Nombre: `inventario_db`
   - Click en "Save"

**O desde la línea de comandos (psql):**

```powershell
# Conectarse a PostgreSQL (te pedirá la contraseña)
psql -U postgres

# Crear la base de datos
CREATE DATABASE inventario_db;

# Salir de psql
\q
```

## Paso 4: Configurar el Proyecto

1. Navega a la carpeta del proyecto:
   ```powershell
   cd "C:\Users\juan-\Documents\github juan\inventario-backend"
   ```

2. Instala las dependencias:
   ```powershell
   go mod download
   ```

3. Crea el archivo `.env` copiando el ejemplo:
   ```powershell
   Copy-Item env.example .env
   ```

4. Edita el archivo `.env` con un editor de texto (Notepad, VS Code, etc.) y configura:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña_de_postgres
   DB_NAME=inventario_db
   DB_SSLMODE=disable
   SERVER_PORT=8080
   ```

   **Importante:** Reemplaza `tu_contraseña_de_postgres` con la contraseña que configuraste durante la instalación de PostgreSQL.

## Paso 5: Ejecutar el Script SQL

Ejecuta el script SQL para crear las tablas:

**Opción 1: Desde pgAdmin**
1. Abre pgAdmin
2. Conéctate al servidor
3. Selecciona la base de datos `inventario_db`
4. Click en "Tools" → "Query Tool"
5. Abre el archivo `database/schema.sql`
6. Copia y pega el contenido
7. Ejecuta el script (F5 o botón "Execute")

**Opción 2: Desde la línea de comandos**
```powershell
# Desde la carpeta del proyecto
psql -U postgres -d inventario_db -f database/schema.sql
```

Te pedirá la contraseña de PostgreSQL.

## Paso 6: Ejecutar el Servidor

1. Desde la carpeta del proyecto, ejecuta:
   ```powershell
   go run main.go
   ```

2. Deberías ver:
   ```
   ✅ Conexión a la base de datos establecida correctamente
   🚀 Servidor iniciado en el puerto 8080
   📡 API disponible en http://localhost:8080/api
   ❤️  Health check en http://localhost:8080/health
   ```

## Paso 7: Probar la API

Abre una nueva ventana de PowerShell y prueba los endpoints:

### Verificar que el servidor está funcionando:
```powershell
curl http://localhost:8080/health
```

### Obtener todas las categorías:
```powershell
curl http://localhost:8080/api/categorias
```

### Obtener todos los productos:
```powershell
curl http://localhost:8080/api/productos
```

### Crear una nueva categoría:
```powershell
curl -X POST http://localhost:8080/api/categorias `
  -H "Content-Type: application/json" `
  -d '{\"nombre\":\"Electrónica\",\"descripcion\":\"Dispositivos electrónicos\"}'
```

## Solución de Problemas

### Error: "no se puede conectar al servidor"
- Verifica que PostgreSQL esté corriendo
- Verifica que el puerto en `.env` sea correcto (por defecto 5432)
- Verifica que el usuario y contraseña sean correctos

### Error: "database does not exist"
- Asegúrate de haber creado la base de datos `inventario_db`
- Verifica el nombre en el archivo `.env`

### Error: "relation does not exist"
- Asegúrate de haber ejecutado el script `database/schema.sql`
- Verifica que estés conectado a la base de datos correcta

### Error al ejecutar `go run main.go`
- Verifica que Go esté instalado: `go version`
- Instala las dependencias: `go mod download`
- Verifica que el archivo `.env` exista y tenga la configuración correcta

## Comandos Útiles

```powershell
# Ver versión de Go
go version

# Instalar dependencias
go mod download

# Limpiar y reinstalar dependencias
go mod tidy

# Compilar el proyecto
go build -o inventario-backend.exe main.go

# Ejecutar el binario compilado
.\inventario-backend.exe
```

## Próximos Pasos

Una vez que el servidor esté corriendo, puedes:
- Usar herramientas como Postman para probar la API
- Crear un frontend que consuma esta API
- Agregar autenticación y autorización
- Agregar más funcionalidades según tus necesidades

