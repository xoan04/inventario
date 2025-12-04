package models

import "time"

type TipoMovimiento string

const (
	TipoEntrada TipoMovimiento = "entrada"
	TipoSalida  TipoMovimiento = "salida"
)

type MovimientoInventario struct {
	ID         int            `json:"id"`
	ProductoID int            `json:"producto_id"`
	Producto   *Producto      `json:"producto,omitempty"`
	Tipo       TipoMovimiento `json:"tipo"`
	Cantidad   int            `json:"cantidad"`
	Motivo     string         `json:"motivo"`
	CreatedAt  time.Time      `json:"created_at"`
}

type MovimientoInventarioRequest struct {
	ProductoID int            `json:"producto_id"`
	Tipo       TipoMovimiento `json:"tipo"`
	Cantidad   int            `json:"cantidad"`
	Motivo     string         `json:"motivo"`
}

