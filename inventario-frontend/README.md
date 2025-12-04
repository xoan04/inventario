# Sistema de Inventario - Frontend

Frontend del Sistema de Inventario construido con Next.js 14, TypeScript, Tailwind CSS y shadcn/ui.

## 🏗️ Arquitectura MVC

El proyecto sigue el patrón Modelo-Vista-Controlador (MVC):

- **Models** (`/models`): Definiciones de tipos TypeScript que representan las entidades del sistema
- **Views** (`/views`): Componentes de UI reutilizables (formularios, tablas, etc.)
- **Controllers** (`/controllers`): Servicios que manejan la lógica de negocio y comunicación con la API

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Backend corriendo en `http://localhost:8080`

### Instalación

1. Instala las dependencias:

```bash
npm install
```

2. Configura las variables de entorno:

Copia el archivo `env.example` a `.env.local`:

```bash
cp env.example .env.local
```

Asegúrate de que `NEXT_PUBLIC_API_URL` apunte a tu backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
inventario-frontend/
├── app/                    # Páginas y layout de Next.js
│   ├── layout.tsx         # Layout principal con navegación
│   ├── page.tsx           # Página de inicio
│   ├── productos/         # Página de productos
│   ├── categorias/        # Página de categorías
│   └── movimientos/       # Página de movimientos
├── components/            # Componentes de shadcn/ui
│   └── ui/               # Componentes base (Button, Card, Dialog, etc.)
├── controllers/           # Controladores (lógica de negocio)
│   ├── CategoriaController.ts
│   ├── ProductoController.ts
│   └── MovimientoController.ts
├── models/               # Modelos TypeScript
│   ├── Categoria.ts
│   ├── Producto.ts
│   └── MovimientoInventario.ts
├── views/                # Vistas (componentes de UI)
│   ├── CategoriaForm.tsx
│   ├── ProductoForm.tsx
│   └── MovimientoForm.tsx
├── lib/                  # Utilidades
│   ├── api.ts           # Cliente API base
│   └── utils.ts         # Utilidades generales
└── public/              # Archivos estáticos
```

## 🎨 Tecnologías

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utilitarios
- **shadcn/ui**: Componentes UI accesibles y personalizables
- **Lucide React**: Iconos

## 📝 Funcionalidades

### Productos
- Listar todos los productos
- Crear nuevo producto
- Editar producto existente
- Eliminar producto
- Visualizar stock (con alerta si es bajo)

### Categorías
- Listar todas las categorías
- Crear nueva categoría
- Editar categoría existente
- Eliminar categoría

### Movimientos
- Listar todos los movimientos de inventario
- Crear nuevo movimiento (entrada/salida)
- Visualizar historial completo

## 🔧 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter

## 🌐 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL base de la API del backend | `http://localhost:8080/api` |

## 📦 Componentes UI

El proyecto utiliza componentes de shadcn/ui:

- Button
- Card
- Dialog
- Input
- Label
- Select
- Table

Todos los componentes están en `/components/ui` y pueden ser personalizados según tus necesidades.

## 🐛 Manejo de Errores

El proyecto incluye manejo de errores centralizado:

- La clase `ApiError` en `lib/api.ts` maneja errores de la API
- Los formularios muestran mensajes de error al usuario
- Las páginas muestran errores de carga de datos

## 📄 Licencia

Este proyecto es parte del Sistema de Inventario.

