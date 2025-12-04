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
import { Categoria, CategoriaRequest } from "@/models/Categoria";

interface CategoriaFormProps {
  categoria?: Categoria;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoriaRequest) => Promise<void>;
}

export function CategoriaForm({
  categoria,
  open,
  onOpenChange,
  onSubmit,
}: CategoriaFormProps) {
  const [formData, setFormData] = useState<CategoriaRequest>({
    nombre: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (categoria) {
        setFormData({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
        });
      } else {
        setFormData({
          nombre: "",
          descripcion: "",
        });
      }
      setError(null);
    }
  }, [open, categoria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.nombre.trim()) {
        throw new Error("El nombre es requerido");
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
            {categoria ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {categoria
              ? "Modifica los datos de la categoría"
              : "Completa los datos para crear una nueva categoría"}
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
              {loading ? "Guardando..." : categoria ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

