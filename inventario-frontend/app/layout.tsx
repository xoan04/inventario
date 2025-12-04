import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Package, FolderTree, ArrowLeftRight } from "lucide-react";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Inventario",
  description: "Gestión de inventario con productos, categorías y movimientos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <nav className="border-b">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Sistema de Inventario</h1>
                  <div className="flex gap-4">
                    <Link
                      href="/productos"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <Package className="h-4 w-4" />
                      Productos
                    </Link>
                    <Link
                      href="/categorias"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <FolderTree className="h-4 w-4" />
                      Categorías
                    </Link>
                    <Link
                      href="/movimientos"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                      Movimientos
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

