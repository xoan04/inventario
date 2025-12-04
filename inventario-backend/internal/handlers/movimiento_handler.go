package handlers

import (
	"encoding/json"
	"inventario-backend/internal/database"
	"inventario-backend/internal/models"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func GetMovimientos(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query(`
		SELECT m.id, m.producto_id, m.tipo, m.cantidad, m.motivo, m.created_at,
		       p.id, p.nombre, p.descripcion, p.precio, p.stock
		FROM movimientos_inventario m
		LEFT JOIN productos p ON m.producto_id = p.id
		ORDER BY m.created_at DESC
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var movimientos []models.MovimientoInventario
	for rows.Next() {
		var m models.MovimientoInventario
		var p models.Producto
		err := rows.Scan(&m.ID, &m.ProductoID, &m.Tipo, &m.Cantidad, &m.Motivo, &m.CreatedAt,
			&p.ID, &p.Nombre, &p.Descripcion, &p.Precio, &p.Stock)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		m.Producto = &p
		movimientos = append(movimientos, m)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(movimientos)
}

func GetMovimiento(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var m models.MovimientoInventario
	var p models.Producto
	err = database.DB.QueryRow(`
		SELECT m.id, m.producto_id, m.tipo, m.cantidad, m.motivo, m.created_at,
		       p.id, p.nombre, p.descripcion, p.precio, p.stock
		FROM movimientos_inventario m
		LEFT JOIN productos p ON m.producto_id = p.id
		WHERE m.id = $1
	`, id).Scan(&m.ID, &m.ProductoID, &m.Tipo, &m.Cantidad, &m.Motivo, &m.CreatedAt,
		&p.ID, &p.Nombre, &p.Descripcion, &p.Precio, &p.Stock)

	if err != nil {
		http.Error(w, "Movimiento no encontrado", http.StatusNotFound)
		return
	}
	m.Producto = &p

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(m)
}

func CreateMovimiento(w http.ResponseWriter, r *http.Request) {
	var req models.MovimientoInventarioRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Tipo != models.TipoEntrada && req.Tipo != models.TipoSalida {
		http.Error(w, "El tipo debe ser 'entrada' o 'salida'", http.StatusBadRequest)
		return
	}

	if req.Cantidad <= 0 {
		http.Error(w, "La cantidad debe ser mayor a 0", http.StatusBadRequest)
		return
	}

	// Verificar que el producto existe
	var productoExists bool
	err := database.DB.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM productos WHERE id = $1)
	`, req.ProductoID).Scan(&productoExists)

	if err != nil || !productoExists {
		http.Error(w, "El producto especificado no existe", http.StatusBadRequest)
		return
	}

	// Verificar stock disponible si es una salida
	if req.Tipo == models.TipoSalida {
		var stockActual int
		err := database.DB.QueryRow(`
			SELECT stock FROM productos WHERE id = $1
		`, req.ProductoID).Scan(&stockActual)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if stockActual < req.Cantidad {
			http.Error(w, "Stock insuficiente", http.StatusBadRequest)
			return
		}
	}

	// Iniciar transacción
	tx, err := database.DB.Begin()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Crear el movimiento
	var movimientoID int
	err = tx.QueryRow(`
		INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, motivo) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id
	`, req.ProductoID, req.Tipo, req.Cantidad, req.Motivo).Scan(&movimientoID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Actualizar el stock del producto
	if req.Tipo == models.TipoEntrada {
		_, err = tx.Exec(`
			UPDATE productos 
			SET stock = stock + $1, updated_at = NOW() 
			WHERE id = $2
		`, req.Cantidad, req.ProductoID)
	} else {
		_, err = tx.Exec(`
			UPDATE productos 
			SET stock = stock - $1, updated_at = NOW() 
			WHERE id = $2
		`, req.Cantidad, req.ProductoID)
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Confirmar transacción
	if err = tx.Commit(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Obtener el movimiento creado
	var m models.MovimientoInventario
	var p models.Producto
	database.DB.QueryRow(`
		SELECT m.id, m.producto_id, m.tipo, m.cantidad, m.motivo, m.created_at,
		       p.id, p.nombre, p.descripcion, p.precio, p.stock
		FROM movimientos_inventario m
		LEFT JOIN productos p ON m.producto_id = p.id
		WHERE m.id = $1
	`, movimientoID).Scan(&m.ID, &m.ProductoID, &m.Tipo, &m.Cantidad, &m.Motivo, &m.CreatedAt,
		&p.ID, &p.Nombre, &p.Descripcion, &p.Precio, &p.Stock)
	m.Producto = &p

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(m)
}

func GetMovimientosByProducto(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productoID, err := strconv.Atoi(vars["producto_id"])
	if err != nil {
		http.Error(w, "ID de producto inválido", http.StatusBadRequest)
		return
	}

	rows, err := database.DB.Query(`
		SELECT m.id, m.producto_id, m.tipo, m.cantidad, m.motivo, m.created_at,
		       p.id, p.nombre, p.descripcion, p.precio, p.stock
		FROM movimientos_inventario m
		LEFT JOIN productos p ON m.producto_id = p.id
		WHERE m.producto_id = $1
		ORDER BY m.created_at DESC
	`, productoID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var movimientos []models.MovimientoInventario
	for rows.Next() {
		var m models.MovimientoInventario
		var p models.Producto
		err := rows.Scan(&m.ID, &m.ProductoID, &m.Tipo, &m.Cantidad, &m.Motivo, &m.CreatedAt,
			&p.ID, &p.Nombre, &p.Descripcion, &p.Precio, &p.Stock)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		m.Producto = &p
		movimientos = append(movimientos, m)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(movimientos)
}

