"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoriaForm } from "@/views/CategoriaForm";
import { Categoria, CategoriaRequest } from "@/models/Categoria";
import { CategoriaController } from "@/controllers/CategoriaController";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/hooks/useConfirm";
import { Input } from "@/components/ui/input";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const loadCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CategoriaController.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Error al cargar categorías";
      setError(errorMessage);
      setCategorias([]); // Asegurar que siempre sea un array
      showToast({
        type: "error",
        title: "Error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  const handleCreate = () => {
    setEditingCategoria(undefined);
    setFormOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: "¿Eliminar categoría?",
      description: "Esta acción no se puede deshacer. Si hay productos asociados, no podrás eliminar esta categoría.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });

    if (!confirmed) {
      return;
    }

    try {
      await CategoriaController.delete(id);
      showToast({
        type: "success",
        title: "Categoría eliminada",
        message: "La categoría se ha eliminado correctamente",
      });
      await loadCategorias();
    } catch (err) {
      showToast({
        type: "error",
        title: "Error",
        message:
          err instanceof ApiError
            ? err.message
            : "Error al eliminar categoría",
      });
    }
  };

  const handleSubmit = async (data: CategoriaRequest) => {
    try {
      if (editingCategoria) {
        await CategoriaController.update(editingCategoria.id, data);
        showToast({
          type: "success",
          title: "Categoría actualizada",
          message: "La categoría se ha actualizado correctamente",
        });
      } else {
        await CategoriaController.create(data);
        showToast({
          type: "success",
          title: "Categoría creada",
          message: "La categoría se ha creado correctamente",
        });
      }
      await loadCategorias();
    } catch (err) {
      showToast({
        type: "error",
        title: "Error",
        message:
          err instanceof ApiError
            ? err.message
            : editingCategoria
            ? "Error al actualizar categoría"
            : "Error al crear categoría",
      });
      throw err;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  // Filtrar categorías basado en el término de búsqueda
  const filteredCategorias = categorias.filter((categoria) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      categoria.nombre.toLowerCase().includes(search) ||
      categoria.descripcion?.toLowerCase().includes(search) ||
      categoria.id.toString().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Categorías</h1>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Nueva Categoría</span>
          <span className="sm:hidden">Nueva</span>
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre, descripción o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              {filteredCategorias.length} resultado(s) encontrado(s)
            </p>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Cargando...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            {categorias.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay categorías registradas
              </div>
            ) : filteredCategorias.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron categorías que coincidan con &quot;{searchTerm}&quot;
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategorias.map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell>{categoria.id}</TableCell>
                      <TableCell className="font-medium">
                        {categoria.nombre}
                      </TableCell>
                      <TableCell>{categoria.descripcion}</TableCell>
                      <TableCell>{formatDate(categoria.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(categoria)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(categoria.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <CategoriaForm
        categoria={editingCategoria}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog />
    </div>
  );
}

