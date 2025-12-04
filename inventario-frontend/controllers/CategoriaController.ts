import fetchApi from "@/lib/api";
import { Categoria, CategoriaRequest } from "@/models/Categoria";

export class CategoriaController {
  static async getAll(): Promise<Categoria[]> {
    return fetchApi<Categoria[]>("/categorias");
  }

  static async getById(id: number): Promise<Categoria> {
    return fetchApi<Categoria>(`/categorias/${id}`);
  }

  static async create(data: CategoriaRequest): Promise<Categoria> {
    return fetchApi<Categoria>("/categorias", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: number, data: CategoriaRequest): Promise<Categoria> {
    return fetchApi<Categoria>(`/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async delete(id: number): Promise<void> {
    return fetchApi<void>(`/categorias/${id}`, {
      method: "DELETE",
    });
  }
}

