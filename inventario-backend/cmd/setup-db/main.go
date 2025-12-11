package main

import (
	"fmt"
	"inventario-backend/internal/config"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	// Verificar si se quiere hacer reset
	reset := len(os.Args) > 1 && (os.Args[1] == "--reset" || os.Args[1] == "-r")

	// Cargar configuración desde .env
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("❌ Error al cargar la configuración: %v", err)
	}

	if reset {
		fmt.Println("⚠️  ADVERTENCIA: Esto eliminará todos los datos de la base de datos!")
		fmt.Println("Presiona Ctrl+C para cancelar, o Enter para continuar...")
		fmt.Scanln()

		fmt.Println("🔄 Reiniciando base de datos...")

		// Configurar variable de entorno PGPASSWORD
		os.Setenv("PGPASSWORD", cfg.DBPassword)

		// Ejecutar DROP SCHEMA
		dropCmd := exec.Command("psql",
			"-h", cfg.DBHost,
			"-p", cfg.DBPort,
			"-U", cfg.DBUser,
			"-d", cfg.DBName,
			"-c", "DROP SCHEMA public CASCADE; CREATE SCHEMA public;",
		)

		dropCmd.Stdout = os.Stdout
		dropCmd.Stderr = os.Stderr

		if err := dropCmd.Run(); err != nil {
			log.Fatalf("❌ Error al reiniciar el schema: %v", err)
		}

		fmt.Println("✅ Schema reiniciado. Ejecutando schema.sql...")
		fmt.Println()
	}

	// Obtener la ruta del schema.sql
	schemaPath := "database/schema.sql"

	// Si no existe, intentar desde la raíz del proyecto
	if _, err := os.Stat(schemaPath); os.IsNotExist(err) {
		// Buscar desde diferentes ubicaciones
		possiblePaths := []string{
			"../database/schema.sql",
			"../../database/schema.sql",
			"inventario-backend/database/schema.sql",
		}

		found := false
		for _, path := range possiblePaths {
			if _, err := os.Stat(path); err == nil {
				schemaPath = path
				found = true
				break
			}
		}

		if !found {
			// Intentar desde el directorio del ejecutable
			execPath, _ := os.Executable()
			execDir := filepath.Dir(execPath)
			schemaPath = filepath.Join(execDir, "..", "database", "schema.sql")
		}
	}

	absPath, _ := filepath.Abs(schemaPath)
	if _, err := os.Stat(absPath); os.IsNotExist(err) {
		log.Fatalf("❌ No se encontró el archivo schema.sql en: %s", absPath)
	}

	fmt.Println("🔌 Conectando a PostgreSQL...")
	fmt.Printf("   Host: %s\n", cfg.DBHost)
	fmt.Printf("   Puerto: %s\n", cfg.DBPort)
	fmt.Printf("   Usuario: %s\n", cfg.DBUser)
	fmt.Printf("   Base de datos: %s\n", cfg.DBName)
	fmt.Println()

	fmt.Printf("📋 Ejecutando schema.sql desde: %s\n\n", absPath)

	// Configurar variable de entorno PGPASSWORD
	os.Setenv("PGPASSWORD", cfg.DBPassword)

	// Construir comando psql
	cmd := exec.Command("psql",
		"-h", cfg.DBHost,
		"-p", cfg.DBPort,
		"-U", cfg.DBUser,
		"-d", cfg.DBName,
		"-f", absPath,
	)

	// Mostrar la salida en tiempo real
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	// Ejecutar el comando
	if err := cmd.Run(); err != nil {
		log.Fatalf("❌ Error al ejecutar el schema: %v\nAsegúrate de tener PostgreSQL instalado y psql en tu PATH", err)
	}

	fmt.Println()
	fmt.Println("✅ Schema ejecutado correctamente!")
}
