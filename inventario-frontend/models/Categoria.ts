export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

export interface CategoriaRequest {
  nombre: string;
  descripcion: string;
}

