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
import { MovimientoForm } from "@/views/MovimientoForm";
import {
  MovimientoInventario,
  MovimientoInventarioRequest,
} from "@/models/MovimientoInventario";
import { MovimientoController } from "@/controllers/MovimientoController";
import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const { showToast } = useToast();

  const loadMovimientos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MovimientoController.getAll();
      setMovimientos(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Error al cargar movimientos";
      setError(errorMessage);
      setMovimientos([]); // Asegurar que siempre sea un array
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
    loadMovimientos();
  }, [loadMovimientos]);

  const handleCreate = () => {
    setFormOpen(true);
  };

  const handleSubmit = async (data: MovimientoInventarioRequest) => {
    try {
      await MovimientoController.create(data);
      showToast({
        type: "success",
        title: "Movimiento registrado",
        message: `Se ha registrado una ${data.tipo === "entrada" ? "entrada" : "salida"} de ${data.cantidad} unidades`,
      });
      await loadMovimientos();
    } catch (err) {
      showToast({
        type: "error",
        title: "Error",
        message:
          err instanceof ApiError
            ? err.message
            : "Error al registrar movimiento",
      });
      throw err;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Movimientos de Inventario</h1>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Nuevo Movimiento</span>
          <span className="sm:hidden">Nuevo</span>
        </Button>
      </div>

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
            <CardTitle>Historial de Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            {movimientos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay movimientos registrados
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientos.map((movimiento) => (
                    <TableRow key={movimiento.id}>
                      <TableCell>{movimiento.id}</TableCell>
                      <TableCell className="font-medium">
                        {movimiento.producto?.nombre || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {movimiento.tipo === "entrada" ? (
                            <>
                              <ArrowUp className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-semibold">
                                Entrada
                              </span>
                            </>
                          ) : (
                            <>
                              <ArrowDown className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 font-semibold">
                                Salida
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{movimiento.cantidad}</TableCell>
                      <TableCell>{movimiento.motivo}</TableCell>
                      <TableCell>{formatDate(movimiento.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <MovimientoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

