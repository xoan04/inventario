package handlers

import (
	"encoding/json"
	"inventario-backend/internal/database"
	"inventario-backend/internal/models"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func GetProductos(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query(`
		SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria_id, 
		       p.created_at, p.updated_at,
		       c.id, c.nombre, c.descripcion
		FROM productos p
		LEFT JOIN categorias c ON p.categoria_id = c.id
		ORDER BY p.nombre
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var productos []models.Producto
	for rows.Next() {
		var p models.Producto
		var c models.Categoria
		err := rows.Scan(&p.ID, &p.Nombre, &p.Descripcion, &p.Precio, &p.Stock, &p.CategoriaID,
			&p.CreatedAt, &p.UpdatedAt,
			&c.ID, &c.Nombre, &c.Descripcion)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		p.Categoria = &c
		productos = append(productos, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(productos)
}

func GetProducto(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var p models.Producto
	var c models.Categoria
	err = database.DB.QueryRow(`
		SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria_id, 
		       p.created_at, p.updated_at,
		       c.id, c.nombre, c.descripcion
		FROM productos p
		LEFT JOIN categorias c ON p.categoria_id = c.id
		WHERE p.id = $1
	`, id).Scan(&p.ID, &p.Nombre, &p.Descripcion, &p.Precio, &p.Stock, &p.CategoriaID,
		&p.CreatedAt, &p.UpdatedAt,
		&c.ID, &c.Nombre, &c.Descripcion)

	if err != nil {
		http.Error(w, "Producto no encontrado", http.StatusNotFound)
		return
	}
	p.Categoria = &c

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func CreateProducto(w http.ResponseWriter, r *http.Request) {
	var req models.ProductoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Nombre == "" {
		http.Error(w, "El nombre es requerido", http.StatusBadRequest)
		return
	}

	if req.Precio < 0 {
		http.Error(w, "El precio no puede ser negativo", http.StatusBadRequest)
		return
	}

	if req.Stock < 0 {
		http.Error(w, "El stock no puede ser negativo", http.StatusBadRequest)
		return
	}

	// Verificar que la categoría existe
	var categoriaExists bool
	err := database.DB.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM categorias WHERE id = $1)
	`, req.CategoriaID).Scan(&categoriaExists)

	if err != nil || !categoriaExists {
		http.Error(w, "La categoría especificada no existe", http.StatusBadRequest)
		return
	}

	var id int
	err = database.DB.QueryRow(`
		INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) 
		VALUES ($1, $2, $3, $4, $5) 
		RETURNING id
	`, req.Nombre, req.Descripcion, req.Precio, req.Stock, req.CategoriaID).Scan(&id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var p models.Producto
	var c models.Categoria
	database.DB.QueryRow(`
		SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria_id, 
		       p.created_at, p.updated_at,
		       c.id, c.nombre, c.descripcion
		FROM productos p
		LEFT JOIN categorias c ON p.categoria_id = c.id
		WHERE p.id = $1
	`, id).Scan(&p.ID, &p.Nombre, &p.Descripcion, &p.Precio, &p.Stock, &p.CategoriaID,
		&p.CreatedAt, &p.UpdatedAt,
		&c.ID, &c.Nombre, &c.Descripcion)
	p.Categoria = &c

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(p)
}

func UpdateProducto(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var req models.ProductoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Nombre == "" {
		http.Error(w, "El nombre es requerido", http.StatusBadRequest)
		return
	}

	if req.Precio < 0 {
		http.Error(w, "El precio no puede ser negativo", http.StatusBadRequest)
		return
	}

	if req.Stock < 0 {
		http.Error(w, "El stock no puede ser negativo", http.StatusBadRequest)
		return
	}

	// Verificar que la categoría existe
	var categoriaExists bool
	err = database.DB.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM categorias WHERE id = $1)
	`, req.CategoriaID).Scan(&categoriaExists)

	if err != nil || !categoriaExists {
		http.Error(w, "La categoría especificada no existe", http.StatusBadRequest)
		return
	}

	result, err := database.DB.Exec(`
		UPDATE productos 
		SET nombre = $1, descripcion = $2, precio = $3, stock = $4, 
		    categoria_id = $5, updated_at = NOW() 
		WHERE id = $6
	`, req.Nombre, req.Descripcion, req.Precio, req.Stock, req.CategoriaID, id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Producto no encontrado", http.StatusNotFound)
		return
	}

	var p models.Producto
	var c models.Categoria
	database.DB.QueryRow(`
		SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria_id, 
		       p.created_at, p.updated_at,
		       c.id, c.nombre, c.descripcion
		FROM productos p
		LEFT JOIN categorias c ON p.categoria_id = c.id
		WHERE p.id = $1
	`, id).Scan(&p.ID, &p.Nombre, &p.Descripcion, &p.Precio, &p.Stock, &p.CategoriaID,
		&p.CreatedAt, &p.UpdatedAt,
		&c.ID, &c.Nombre, &c.Descripcion)
	p.Categoria = &c

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func DeleteProducto(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	result, err := database.DB.Exec("DELETE FROM productos WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Producto no encontrado", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func GetProductosByCategoria(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	categoriaID, err := strconv.Atoi(vars["categoria_id"])
	if err != nil {
		http.Error(w, "ID de categoría inválido", http.StatusBadRequest)
		return
	}

	rows, err := database.DB.Query(`
		SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria_id, 
		       p.created_at, p.updated_at,
		       c.id, c.nombre, c.descripcion
		FROM productos p
		LEFT JOIN categorias c ON p.categoria_id = c.id
		WHERE p.categoria_id = $1
		ORDER BY p.nombre
	`, categoriaID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var productos []models.Producto
	for rows.Next() {
		var p models.Producto
		var c models.Categoria
		err := rows.Scan(&p.ID, &p.Nombre, &p.Descripcion, &p.Precio, &p.Stock, &p.CategoriaID,
			&p.CreatedAt, &p.UpdatedAt,
			&c.ID, &c.Nombre, &c.Descripcion)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		p.Categoria = &c
		productos = append(productos, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(productos)
}

