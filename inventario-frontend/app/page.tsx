import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Bienvenido al Sistema de Inventario</h1>
        <p className="text-muted-foreground">
          Gestiona tus productos, categorías y movimientos de inventario de manera eficiente
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos
            </CardTitle>
            <CardDescription>
              Administra tu catálogo de productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/productos">
              <Button className="w-full">Ver Productos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Categorías
            </CardTitle>
            <CardDescription>
              Organiza tus productos por categorías
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/categorias">
              <Button className="w-full">Ver Categorías</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Movimientos
            </CardTitle>
            <CardDescription>
              Registra entradas y salidas de inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/movimientos">
              <Button className="w-full">Ver Movimientos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

