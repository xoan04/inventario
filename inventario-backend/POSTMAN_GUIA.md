# Guía de Uso de la Colección de Postman

Esta guía te ayudará a importar y usar la colección de Postman para probar todos los endpoints de la API de Inventario.

## Importar la Colección en Postman

### Opción 1: Importar desde archivo
1. Abre Postman
2. Click en **Import** (botón en la esquina superior izquierda)
3. Selecciona **File** o **Upload Files**
4. Navega y selecciona el archivo `Inventario_API.postman_collection.json`
5. Click en **Import**

### Opción 2: Importar desde URL (si está en un repositorio)
1. Abre Postman
2. Click en **Import**
3. Selecciona **Link**
4. Pega la URL del archivo JSON
5. Click en **Continue** y luego **Import**

## Configurar la Variable de Entorno

La colección usa una variable `base_url` que por defecto está configurada como `http://localhost:8080`.

### Para cambiar la URL base:
1. En Postman, selecciona la colección **Inventario API**
2. Ve a la pestaña **Variables**
3. Edita el valor de `base_url` si tu servidor corre en otro puerto o dominio
4. Guarda los cambios

## Estructura de la Colección

La colección está organizada en las siguientes carpetas:

### 1. Health Check
- **GET /health** - Verifica que el servidor esté funcionando

### 2. Categorías
- **GET /api/categorias** - Obtener todas las categorías
- **GET /api/categorias/{id}** - Obtener categoría por ID
- **POST /api/categorias** - Crear nueva categoría
- **PUT /api/categorias/{id}** - Actualizar categoría
- **DELETE /api/categorias/{id}** - Eliminar categoría

### 3. Productos
- **GET /api/productos** - Obtener todos los productos
- **GET /api/productos/{id}** - Obtener producto por ID
- **POST /api/productos** - Crear nuevo producto
- **PUT /api/productos/{id}** - Actualizar producto
- **DELETE /api/productos/{id}** - Eliminar producto
- **GET /api/productos/categoria/{categoria_id}** - Obtener productos por categoría

### 4. Movimientos de Inventario
- **GET /api/movimientos** - Obtener todos los movimientos
- **GET /api/movimientos/{id}** - Obtener movimiento por ID
- **POST /api/movimientos** - Crear movimiento (entrada o salida)
- **GET /api/movimientos/producto/{producto_id}** - Obtener movimientos por producto

## Orden Recomendado para Probar

### Paso 1: Verificar que el servidor funciona
1. Ejecuta **Health Check** - Deberías recibir `{"status": "ok"}`

### Paso 2: Crear categorías
1. Ejecuta **Crear nueva categoría** con datos de ejemplo
2. Anota el `id` de la categoría creada (aparece en la respuesta)
3. Opcional: Prueba **Obtener todas las categorías** para ver la lista

### Paso 3: Crear productos
1. Ejecuta **Crear nuevo producto**
2. Asegúrate de usar un `categoria_id` que exista (el que creaste en el paso anterior)
3. Anota el `id` del producto creado
4. Opcional: Prueba **Obtener todos los productos** para ver la lista

### Paso 4: Probar movimientos
1. Ejecuta **Crear movimiento - Entrada** para aumentar el stock
2. Verifica el stock del producto con **Obtener producto por ID**
3. Ejecuta **Crear movimiento - Salida** para disminuir el stock
4. Prueba **Obtener movimientos por producto** para ver el historial

### Paso 5: Probar actualizaciones y eliminaciones
1. Prueba **Actualizar producto** o **Actualizar categoría**
2. Prueba **Eliminar producto** (ten cuidado, esto elimina permanentemente)

## Ejemplos de Datos para Probar

### Crear Categoría
```json
{
    "nombre": "Electrónica",
    "descripcion": "Dispositivos y componentes electrónicos"
}
```

### Crear Producto
```json
{
    "nombre": "Laptop Dell Inspiron 15",
    "descripcion": "Laptop Dell con procesador Intel i5, 8GB RAM, 256GB SSD",
    "precio": 899.99,
    "stock": 10,
    "categoria_id": 1
}
```

### Crear Movimiento de Entrada
```json
{
    "producto_id": 1,
    "tipo": "entrada",
    "cantidad": 5,
    "motivo": "Compra de proveedor"
}
```

### Crear Movimiento de Salida
```json
{
    "producto_id": 1,
    "tipo": "salida",
    "cantidad": 2,
    "motivo": "Venta a cliente"
}
```

## Códigos de Respuesta Esperados

- **200 OK** - Operación exitosa (GET, PUT)
- **201 Created** - Recurso creado exitosamente (POST)
- **204 No Content** - Recurso eliminado exitosamente (DELETE)
- **400 Bad Request** - Datos inválidos o validación fallida
- **404 Not Found** - Recurso no encontrado
- **500 Internal Server Error** - Error del servidor

## Errores Comunes y Soluciones

### Error: "Could not get response"
- Verifica que el servidor esté corriendo (`go run main.go`)
- Verifica que la URL base sea correcta (`http://localhost:8080`)

### Error: "connection refused"
- El servidor no está corriendo
- Verifica el puerto en la variable `base_url`

### Error 400: "El nombre es requerido"
- Asegúrate de enviar todos los campos requeridos en el body
- Verifica que el Content-Type sea `application/json`

### Error 400: "La categoría especificada no existe"
- Crea primero la categoría antes de crear productos
- Verifica que el `categoria_id` sea correcto

### Error 400: "Stock insuficiente"
- No puedes hacer una salida si no hay suficiente stock
- Primero crea una entrada para aumentar el stock

## Tips Útiles

1. **Usa variables de entorno**: Puedes crear variables en Postman para IDs dinámicos
   - Crea una variable `categoria_id` y úsala en las requests
   - Crea una variable `producto_id` para reutilizar

2. **Guarda respuestas**: Postman guarda automáticamente las respuestas, úsalas para ver la estructura de datos

3. **Tests automáticos**: Puedes agregar tests en Postman para validar respuestas automáticamente

4. **Pre-request scripts**: Útiles para generar datos dinámicos antes de enviar requests

## Próximos Pasos

Una vez que hayas probado todos los endpoints:
- Puedes crear un entorno de Postman para desarrollo y producción
- Agregar autenticación si la implementas en el futuro
- Crear tests automatizados para validar las respuestas

