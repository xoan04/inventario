import fetchApi from "@/lib/api";
import { Producto, ProductoRequest } from "@/models/Producto";

export class ProductoController {
  static async getAll(): Promise<Producto[]> {
    return fetchApi<Producto[]>("/productos");
  }

  static async getById(id: number): Promise<Producto> {
    return fetchApi<Producto>(`/productos/${id}`);
  }

  static async getByCategoria(categoriaId: number): Promise<Producto[]> {
    return fetchApi<Producto[]>(`/productos/categoria/${categoriaId}`);
  }

  static async create(data: ProductoRequest): Promise<Producto> {
    return fetchApi<Producto>("/productos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: number, data: ProductoRequest): Promise<Producto> {
    return fetchApi<Producto>(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async delete(id: number): Promise<void> {
    return fetchApi<void>(`/productos/${id}`, {
      method: "DELETE",
    });
  }
}

