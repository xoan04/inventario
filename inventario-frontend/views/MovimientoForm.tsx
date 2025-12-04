"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MovimientoInventarioRequest,
  TipoMovimiento,
} from "@/models/MovimientoInventario";
import { Producto } from "@/models/Producto";
import { ProductoController } from "@/controllers/ProductoController";

interface MovimientoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MovimientoInventarioRequest) => Promise<void>;
}

export function MovimientoForm({
  open,
  onOpenChange,
  onSubmit,
}: MovimientoFormProps) {
  const [formData, setFormData] = useState<MovimientoInventarioRequest>({
    producto_id: 0,
    tipo: "entrada",
    cantidad: 0,
    motivo: "",
  });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadProductos();
      setFormData({
        producto_id: 0,
        tipo: "entrada",
        cantidad: 0,
        motivo: "",
      });
      setError(null);
    }
  }, [open]);

  const loadProductos = async () => {
    try {
      const data = await ProductoController.getAll();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar productos");
      setProductos([]); // Asegurar que siempre sea un array
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (formData.producto_id === 0) {
        throw new Error("Debe seleccionar un producto");
      }
      if (formData.cantidad <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
      }
      if (!formData.motivo.trim()) {
        throw new Error("El motivo es requerido");
      }

      await onSubmit(formData);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Nuevo Movimiento</DialogTitle>
          <DialogDescription className="text-sm">
            Registra una entrada o salida de inventario
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
            <div className="grid gap-2">
              <Label htmlFor="producto">Producto *</Label>
              <Select
                value={formData.producto_id.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    producto_id: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {productos && productos.length > 0 ? (
                    productos.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id.toString()}>
                        {prod.nombre} (Stock: {prod.stock})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No hay productos disponibles
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: TipoMovimiento) =>
                  setFormData({
                    ...formData,
                    tipo: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="salida">Salida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cantidad">Cantidad *</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cantidad: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="motivo">Motivo *</Label>
              <Input
                id="motivo"
                value={formData.motivo}
                onChange={(e) =>
                  setFormData({ ...formData, motivo: e.target.value })
                }
                required
              />
            </div>
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Guardando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

