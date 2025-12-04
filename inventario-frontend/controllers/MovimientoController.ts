import fetchApi from "@/lib/api";
import {
  MovimientoInventario,
  MovimientoInventarioRequest,
} from "@/models/MovimientoInventario";

export class MovimientoController {
  static async getAll(): Promise<MovimientoInventario[]> {
    return fetchApi<MovimientoInventario[]>("/movimientos");
  }

  static async getById(id: number): Promise<MovimientoInventario> {
    return fetchApi<MovimientoInventario>(`/movimientos/${id}`);
  }

  static async getByProducto(productoId: number): Promise<MovimientoInventario[]> {
    return fetchApi<MovimientoInventario[]>(
      `/movimientos/producto/${productoId}`
    );
  }

  static async create(
    data: MovimientoInventarioRequest
  ): Promise<MovimientoInventario> {
    return fetchApi<MovimientoInventario>("/movimientos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

