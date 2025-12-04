package models

import "time"

type Producto struct {
	ID          int       `json:"id"`
	Nombre      string    `json:"nombre"`
	Descripcion string    `json:"descripcion"`
	Precio      float64   `json:"precio"`
	Stock       int       `json:"stock"`
	CategoriaID int       `json:"categoria_id"`
	Categoria   *Categoria `json:"categoria,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ProductoRequest struct {
	Nombre      string  `json:"nombre"`
	Descripcion string  `json:"descripcion"`
	Precio      float64 `json:"precio"`
	Stock       int     `json:"stock"`
	CategoriaID int     `json:"categoria_id"`
}

