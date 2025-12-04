.PHONY: help run build test clean db-setup db-reset

help: ## Mostrar esta ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

run: ## Ejecutar el servidor en modo desarrollo
	go run main.go

build: ## Compilar el proyecto
	go build -o inventario-backend main.go

test: ## Ejecutar tests
	go test -v ./...

clean: ## Limpiar archivos compilados
	rm -f inventario-backend
	rm -f *.exe

db-setup: ## Configurar la base de datos (requiere PostgreSQL)
	@echo "Asegúrate de tener PostgreSQL corriendo y haber creado la base de datos 'inventario_db'"
	@echo "Ejecuta: psql -U postgres -d inventario_db -f database/schema.sql"

db-reset: ## Reiniciar la base de datos (CUIDADO: elimina todos los datos)
	@echo "⚠️  Esto eliminará todos los datos. Presiona Ctrl+C para cancelar..."
	@sleep 3
	psql -U postgres -d inventario_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	psql -U postgres -d inventario_db -f database/schema.sql

deps: ## Instalar dependencias
	go mod download
	go mod tidy

