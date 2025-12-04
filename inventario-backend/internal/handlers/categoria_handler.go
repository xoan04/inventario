package handlers

import (
	"encoding/json"
	"inventario-backend/internal/database"
	"inventario-backend/internal/models"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func GetCategorias(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query(`
		SELECT id, nombre, descripcion, created_at, updated_at 
		FROM categorias 
		ORDER BY nombre
	`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var categorias []models.Categoria
	for rows.Next() {
		var c models.Categoria
		err := rows.Scan(&c.ID, &c.Nombre, &c.Descripcion, &c.CreatedAt, &c.UpdatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		categorias = append(categorias, c)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categorias)
}

func GetCategoria(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var c models.Categoria
	err = database.DB.QueryRow(`
		SELECT id, nombre, descripcion, created_at, updated_at 
		FROM categorias 
		WHERE id = $1
	`, id).Scan(&c.ID, &c.Nombre, &c.Descripcion, &c.CreatedAt, &c.UpdatedAt)

	if err != nil {
		http.Error(w, "Categoría no encontrada", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func CreateCategoria(w http.ResponseWriter, r *http.Request) {
	var req models.CategoriaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Nombre == "" {
		http.Error(w, "El nombre es requerido", http.StatusBadRequest)
		return
	}

	var id int
	err := database.DB.QueryRow(`
		INSERT INTO categorias (nombre, descripcion) 
		VALUES ($1, $2) 
		RETURNING id
	`, req.Nombre, req.Descripcion).Scan(&id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var c models.Categoria
	database.DB.QueryRow(`
		SELECT id, nombre, descripcion, created_at, updated_at 
		FROM categorias 
		WHERE id = $1
	`, id).Scan(&c.ID, &c.Nombre, &c.Descripcion, &c.CreatedAt, &c.UpdatedAt)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(c)
}

func UpdateCategoria(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var req models.CategoriaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Nombre == "" {
		http.Error(w, "El nombre es requerido", http.StatusBadRequest)
		return
	}

	result, err := database.DB.Exec(`
		UPDATE categorias 
		SET nombre = $1, descripcion = $2, updated_at = NOW() 
		WHERE id = $3
	`, req.Nombre, req.Descripcion, id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Categoría no encontrada", http.StatusNotFound)
		return
	}

	var c models.Categoria
	database.DB.QueryRow(`
		SELECT id, nombre, descripcion, created_at, updated_at 
		FROM categorias 
		WHERE id = $1
	`, id).Scan(&c.ID, &c.Nombre, &c.Descripcion, &c.CreatedAt, &c.UpdatedAt)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func DeleteCategoria(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	// Verificar si hay productos asociados
	var count int
	err = database.DB.QueryRow(`
		SELECT COUNT(*) FROM productos WHERE categoria_id = $1
	`, id).Scan(&count)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if count > 0 {
		http.Error(w, "No se puede eliminar la categoría porque tiene productos asociados", http.StatusBadRequest)
		return
	}

	result, err := database.DB.Exec("DELETE FROM categorias WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Categoría no encontrada", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

