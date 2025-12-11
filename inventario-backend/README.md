# Sistema de Gestión de Inventario - Backend

Backend desarrollado en Go con PostgreSQL para la gestión de inventario.

## Características

- ✅ Gestión de productos (CRUD completo)
- ✅ Gestión de categorías
- ✅ Control de stock
- ✅ Movimientos de inventario (entradas y salidas)
- ✅ API RESTful

## Requisitos Previos

- Go 1.21 o superior
- PostgreSQL 12 o superior
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd inventario-backend
```

### 2. Instalar dependencias

```bash
go mod download
```

### 3. Configurar Base de Datos

1. Crea una base de datos en PostgreSQL:

```sql
CREATE DATABASE inventario_db;
```

2. Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

3. Edita el archivo `.env` con tus credenciales de PostgreSQL:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=inventario_db
DB_SSLMODE=disable
SERVER_PORT=8080
```

### 4. Ejecutar migraciones

Tienes varias opciones para ejecutar el schema usando las credenciales del archivo `.env`:

**Opción 1: Usando el programa Go (recomendado - funciona en cualquier plataforma)**

```bash
go run cmd/setup-db/main.go
```

**Opción 2: Usando el script de PowerShell (solo Windows)**

```powershell
.\run-schema.ps1
```

O usando el Makefile:

```bash
make db-setup          # Usa el programa Go
make db-setup-ps1      # Usa el script PowerShell (solo Windows)
```

**Opción 3: Manualmente (usando psql directamente)**

Si prefieres ejecutarlo manualmente, primero carga las variables del `.env` y luego ejecuta:

```bash
psql -h localhost -p 5432 -U postgres -d inventario_db -f database/schema.sql
```

O desde psql:

```bash
psql -U postgres -d inventario_db
\i database/schema.sql
```

### 5. Ejecutar el servidor

```bash
go run main.go
```

El servidor estará disponible en `http://localhost:8080`

## Estructura del Proyecto

```
inventario-backend/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── database/
│   │   └── db.go
│   ├── models/
│   │   ├── producto.go
│   │   ├── categoria.go
│   │   └── movimiento_inventario.go
│   ├── handlers/
│   │   ├── producto_handler.go
│   │   ├── categoria_handler.go
│   │   └── movimiento_handler.go
│   └── routes/
│       └── routes.go
├── database/
│   └── schema.sql
├── go.mod
├── go.sum
├── .env.example
├── Inventario_API.postman_collection.json
├── POSTMAN_GUIA.md
├── INSTALACION.md
└── README.md
```

## Endpoints de la API

### Productos

- `GET /api/productos` - Listar todos los productos
- `GET /api/productos/{id}` - Obtener un producto por ID
- `POST /api/productos` - Crear un nuevo producto
- `PUT /api/productos/{id}` - Actualizar un producto
- `DELETE /api/productos/{id}` - Eliminar un producto
- `GET /api/productos/categoria/{categoria_id}` - Obtener productos por categoría

### Categorías

- `GET /api/categorias` - Listar todas las categorías
- `GET /api/categorias/{id}` - Obtener una categoría por ID
- `POST /api/categorias` - Crear una nueva categoría
- `PUT /api/categorias/{id}` - Actualizar una categoría
- `DELETE /api/categorias/{id}` - Eliminar una categoría

### Movimientos de Inventario

- `GET /api/movimientos` - Listar todos los movimientos
- `GET /api/movimientos/{id}` - Obtener un movimiento por ID
- `POST /api/movimientos` - Crear un nuevo movimiento (entrada/salida)
- `GET /api/movimientos/producto/{producto_id}` - Obtener movimientos de un producto

## Probar la API con Postman

Se incluye una colección completa de Postman con todos los endpoints preconfigurados:

1. **Importar la colección**: Abre Postman e importa el archivo `Inventario_API.postman_collection.json`
2. **Configurar URL base**: La variable `base_url` está configurada como `http://localhost:8080` por defecto
3. **Ver guía completa**: Consulta `POSTMAN_GUIA.md` para instrucciones detalladas

La colección incluye:
- ✅ Todos los endpoints organizados por categorías
- ✅ Ejemplos de requests con datos de prueba
- ✅ Variables de entorno configurables
- ✅ Descripciones de cada endpoint

## Ejemplos de Uso

### Crear un producto

```bash
curl -X POST http://localhost:8080/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop Dell",
    "descripcion": "Laptop Dell Inspiron 15",
    "precio": 899.99,
    "stock": 10,
    "categoria_id": 1
  }'
```

### Obtener todos los productos

```bash
curl http://localhost:8080/api/productos
```

### Crear una entrada de inventario

```bash
curl -X POST http://localhost:8080/api/movimientos \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "tipo": "entrada",
    "cantidad": 5,
    "motivo": "Compra de proveedor"
  }'
```

## Desarrollo

Para ejecutar en modo desarrollo:

```bash
go run main.go
```

## Documentación Adicional

- **INSTALACION.md** - Guía paso a paso para instalar y configurar el proyecto
- **POSTMAN_GUIA.md** - Guía completa para usar la colección de Postman

## Licencia

MIT

