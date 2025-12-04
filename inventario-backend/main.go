package main

import (
	"fmt"
	"inventario-backend/internal/config"
	"inventario-backend/internal/database"
	"inventario-backend/internal/routes"
	"log"
	"net/http"
)

// corsHandler envuelve el handler con middleware CORS a nivel de servidor
func corsHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Configurar cabeceras CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
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

func main() {
	// Cargar configuración
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error al cargar la configuración: %v", err)
	}

	// Inicializar base de datos
	if err := database.InitDB(cfg); err != nil {
		log.Fatalf("Error al conectar con la base de datos: %v", err)
	}
	defer database.CloseDB()

	// Configurar rutas
	router := routes.SetupRoutes()

	// Envolver el router con middleware CORS a nivel de servidor
	handler := corsHandler(router)

	// Iniciar servidor
	port := cfg.ServerPort
	fmt.Printf("🚀 Servidor iniciado en el puerto %s\n", port)
	fmt.Printf("📡 API disponible en http://localhost:%s/api\n", port)
	fmt.Printf("❤️  Health check en http://localhost:%s/health\n", port)

	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}
