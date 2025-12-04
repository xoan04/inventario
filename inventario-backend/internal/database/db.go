package database

import (
	"database/sql"
	"fmt"
	"inventario-backend/internal/config"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB(cfg *config.Config) error {
	var err error
	connStr := cfg.GetDBConnectionString()

	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("error al abrir la conexión a la base de datos: %w", err)
	}

	if err = DB.Ping(); err != nil {
		return fmt.Errorf("error al hacer ping a la base de datos: %w", err)
	}

	fmt.Println("✅ Conexión a la base de datos establecida correctamente")
	return nil
}

func CloseDB() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}

