package routes

import (
	"inventario-backend/internal/handlers"
	"net/http"

	"github.com/gorilla/mux"
)

// corsMiddleware maneja las cabeceras CORS para todas las peticiones
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Configurar cabeceras CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		w.Header().Set("Access-Control-Max-Age", "3600")

		// Si es una petición OPTIONS (preflight), responder inmediatamente
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Continuar con el siguiente handler
		next.ServeHTTP(w, r)
	})
}

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()

	// Middleware para CORS - aplicar a todas las rutas
	r.Use(corsMiddleware)

	// Rutas de Productos
	api := r.PathPrefix("/api").Subrouter()
	// Aplicar CORS también al subrouter
	api.Use(corsMiddleware)
	
	// Productos
	api.HandleFunc("/productos", handlers.GetProductos).Methods("GET")
	api.HandleFunc("/productos/{id}", handlers.GetProducto).Methods("GET")
	api.HandleFunc("/productos", handlers.CreateProducto).Methods("POST")
	api.HandleFunc("/productos/{id}", handlers.UpdateProducto).Methods("PUT")
	api.HandleFunc("/productos/{id}", handlers.DeleteProducto).Methods("DELETE")
	api.HandleFunc("/productos/categoria/{categoria_id}", handlers.GetProductosByCategoria).Methods("GET")

	// Categorías
	api.HandleFunc("/categorias", handlers.GetCategorias).Methods("GET")
	api.HandleFunc("/categorias/{id}", handlers.GetCategoria).Methods("GET")
	api.HandleFunc("/categorias", handlers.CreateCategoria).Methods("POST")
	api.HandleFunc("/categorias/{id}", handlers.UpdateCategoria).Methods("PUT")
	api.HandleFunc("/categorias/{id}", handlers.DeleteCategoria).Methods("DELETE")

	// Movimientos de Inventario
	api.HandleFunc("/movimientos", handlers.GetMovimientos).Methods("GET")
	api.HandleFunc("/movimientos/{id}", handlers.GetMovimiento).Methods("GET")
	api.HandleFunc("/movimientos", handlers.CreateMovimiento).Methods("POST")
	api.HandleFunc("/movimientos/producto/{producto_id}", handlers.GetMovimientosByProducto).Methods("GET")

	// Ruta de salud
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "ok"}`))
	}).Methods("GET")

	return r
}

