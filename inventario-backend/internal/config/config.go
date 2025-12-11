package config

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string
	ServerPort string
}

func LoadConfig() (*Config, error) {
	// Buscar el archivo .env en la raíz del proyecto (inventario-backend)
	// Intenta varias ubicaciones posibles
	envPaths := []string{
		".env",                    // Directorio actual
		"../.env",                 // Un nivel arriba
		"../../.env",              // Dos niveles arriba
		"inventario-backend/.env", // Desde raíz del proyecto
	}

	envLoaded := false
	for _, envPath := range envPaths {
		if err := godotenv.Load(envPath); err == nil {
			absPath, _ := filepath.Abs(envPath)
			log.Printf("✓ Variables de entorno cargadas desde: %s", absPath)
			envLoaded = true
			break
		}
	}

	if !envLoaded {
		// Intentar también buscar desde el directorio actual hacia arriba
		currentDir, err := os.Getwd()
		if err == nil {
			dir := currentDir
			for i := 0; i < 5; i++ { // Buscar hasta 5 niveles arriba
				envPath := filepath.Join(dir, ".env")
				if _, err := os.Stat(envPath); err == nil {
					if err := godotenv.Load(envPath); err == nil {
						log.Printf("✓ Variables de entorno cargadas desde: %s", envPath)
						envLoaded = true
						break
					}
				}
				parent := filepath.Dir(dir)
				if parent == dir {
					break
				}
				dir = parent
			}
		}

		if !envLoaded {
			log.Printf("⚠️  No se encontró archivo .env, usando variables de entorno del sistema")
		}
	}

	// Cargar todas las configuraciones desde las variables de entorno
	config := &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBName:     getEnv("DB_NAME", "inventario_db"),
		DBSSLMode:  getEnv("DB_SSLMODE", "disable"),
		ServerPort: getEnv("SERVER_PORT", "8080"),
	}

	if config.DBPassword == "" {
		return nil, fmt.Errorf("DB_PASSWORD no está configurada. Por favor, configura las variables de entorno en el archivo .env")
	}

	return config, nil
}

func (c *Config) GetDBConnectionString() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
