"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, FolderTree, ArrowLeftRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/productos",
    label: "Productos",
    icon: Package,
  },
  {
    href: "/categorias",
    label: "Categorías",
    icon: FolderTree,
  },
  {
    href: "/movimientos",
    label: "Movimientos",
    icon: ArrowLeftRight,
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Título */}
          <Link href="/" className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold">
              Sistema de Inventario
            </h1>
          </Link>

          {/* Menú Desktop - visible en md y superior */}
          <div className="hidden md:flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Botón Hamburguesa - visible solo en móviles */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Menú Móvil - desplegable */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-2 space-y-1 border-t pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

