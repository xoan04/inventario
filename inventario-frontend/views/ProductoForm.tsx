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
import { Producto, ProductoRequest } from "@/models/Producto";
import { Categoria } from "@/models/Categoria";
import { CategoriaController } from "@/controllers/CategoriaController";

interface ProductoFormProps {
  producto?: Producto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductoRequest) => Promise<void>;
}

export function ProductoForm({
  producto,
  open,
  onOpenChange,
  onSubmit,
}: ProductoFormProps) {
  const [formData, setFormData] = useState<ProductoRequest>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria_id: 0,
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadCategorias();
      if (producto) {
        setFormData({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock,
          categoria_id: producto.categoria_id,
        });
      } else {
        setFormData({
          nombre: "",
          descripcion: "",
          precio: 0,
          stock: 0,
          categoria_id: 0,
        });
      }
      setError(null);
    }
  }, [open, producto]);

  const loadCategorias = async () => {
    try {
      const data = await CategoriaController.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar categorías");
      setCategorias([]); // Asegurar que siempre sea un array
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.nombre.trim()) {
        throw new Error("El nombre es requerido");
      }
      if (formData.precio < 0) {
        throw new Error("El precio no puede ser negativo");
      }
      if (formData.stock < 0) {
        throw new Error("El stock no puede ser negativo");
      }
      if (formData.categoria_id === 0) {
        throw new Error("Debe seleccionar una categoría");
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
          <DialogTitle className="text-lg sm:text-xl">
            {producto ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {producto
              ? "Modifica los datos del producto"
              : "Completa los datos para crear un nuevo producto"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="precio">Precio *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    precio: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Select
                value={formData.categoria_id.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    categoria_id: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias && categorias.length > 0 ? (
                    categorias.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nombre}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No hay categorías disponibles
                    </div>
                  )}
                </SelectContent>
              </Select>
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
              {loading ? "Guardando..." : producto ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

