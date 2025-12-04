import { Producto } from "./Producto";

export type TipoMovimiento = "entrada" | "salida";

export interface MovimientoInventario {
  id: number;
  producto_id: number;
  producto?: Producto;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string;
  created_at: string;
}

export interface MovimientoInventarioRequest {
  producto_id: number;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string;
}

