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

db-setup: ## Configurar la base de datos usando .env (requiere PostgreSQL)
	@echo "🔧 Configurando base de datos usando credenciales del .env..."
	@go run cmd/setup-db/main.go

db-setup-ps1: ## Configurar la base de datos usando PowerShell script (solo Windows)
	@powershell -ExecutionPolicy Bypass -File ./run-schema.ps1

db-reset: ## Reiniciar la base de datos (CUIDADO: elimina todos los datos)
	@echo "⚠️  Esto eliminará todos los datos. Presiona Ctrl+C para cancelar..."
	@sleep 3
	@echo "🔧 Reiniciando base de datos usando credenciales del .env..."
	@go run cmd/setup-db/main.go --reset || echo "Primero ejecuta: go run cmd/setup-db/main.go para ver las opciones"

deps: ## Instalar dependencias
	go mod download
	go mod tidy

