"use client";

import { useState, useEffect } from "react";
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
import { ProductoForm } from "@/views/ProductoForm";
import { Producto, ProductoRequest } from "@/models/Producto";
import { ProductoController } from "@/controllers/ProductoController";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/hooks/useConfirm";
import { Input } from "@/components/ui/input";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductoController.getAll();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Error al cargar productos";
      setError(errorMessage);
      setProductos([]); // Asegurar que siempre sea un array
      showToast({
        type: "error",
        title: "Error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProducto(undefined);
    setFormOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: "¿Eliminar producto?",
      description: "Esta acción no se puede deshacer. ¿Estás seguro de eliminar este producto?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });

    if (!confirmed) {
      return;
    }

    try {
      await ProductoController.delete(id);
      showToast({
        type: "success",
        title: "Producto eliminado",
        message: "El producto se ha eliminado correctamente",
      });
      await loadProductos();
    } catch (err) {
      showToast({
        type: "error",
        title: "Error",
        message:
          err instanceof ApiError
            ? err.message
            : "Error al eliminar producto",
      });
    }
  };

  const handleSubmit = async (data: ProductoRequest) => {
    try {
      if (editingProducto) {
        await ProductoController.update(editingProducto.id, data);
        showToast({
          type: "success",
          title: "Producto actualizado",
          message: "El producto se ha actualizado correctamente",
        });
      } else {
        await ProductoController.create(data);
        showToast({
          type: "success",
          title: "Producto creado",
          message: "El producto se ha creado correctamente",
        });
      }
      await loadProductos();
    } catch (err) {
      showToast({
        type: "error",
        title: "Error",
        message:
          err instanceof ApiError
            ? err.message
            : editingProducto
            ? "Error al actualizar producto"
            : "Error al crear producto",
      });
      throw err;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  // Filtrar productos basado en el término de búsqueda
  const filteredProductos = productos.filter((producto) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      producto.nombre.toLowerCase().includes(search) ||
      producto.descripcion?.toLowerCase().includes(search) ||
      producto.categoria?.nombre.toLowerCase().includes(search) ||
      producto.id.toString().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre, descripción, categoría o ID..."
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
              {filteredProductos.length} resultado(s) encontrado(s)
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
            <CardTitle>Lista de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            {!productos || productos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay productos registrados
              </div>
            ) : filteredProductos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron productos que coincidan con "{searchTerm}"
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProductos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>{producto.id}</TableCell>
                      <TableCell className="font-medium">
                        {producto.nombre}
                      </TableCell>
                      <TableCell>{producto.descripcion}</TableCell>
                      <TableCell>{formatPrice(producto.precio)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            producto.stock < 10
                              ? "text-destructive font-semibold"
                              : ""
                          }
                        >
                          {producto.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        {producto.categoria?.nombre || "Sin categoría"}
                      </TableCell>
                      <TableCell>{formatDate(producto.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(producto)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(producto.id)}
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

      <ProductoForm
        producto={editingProducto}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog />
    </div>
  );
}

