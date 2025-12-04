import { Categoria } from "./Categoria";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id: number;
  categoria?: Categoria;
  created_at: string;
  updated_at: string;
}

export interface ProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id: number;
}

