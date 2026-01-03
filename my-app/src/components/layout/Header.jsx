"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, User, Menu, LayoutDashboard, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LogoutButton from "@/components/auth/LogoutButton";
import { publicAPI } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/public/Logo";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isAdmin, isStaff, isClient } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const showAdminPanel = user && (isAdmin || isStaff);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(() => {
      setSearching(true);

      publicAPI
        .searchProducts(searchQuery)
        .then((res) => {
          setResults(res.data.results || []);
          setShowResults(true);
        })
        .catch(() => {
          setResults([]);
          setShowResults(false);
        })
        .finally(() => setSearching(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    publicAPI
      .getCategories()
      .then((res) => {
        setCategories(res.data.results || []);
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  const handleSelectProduct = (slug) => {
    setSearchQuery("");
    setShowResults(false);
    router.push(`/products/${slug}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowResults(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E7EB]">
      {/* TOP STRIP — Información institucional técnica */}
      <div className="hidden md:block bg-[#F5F7FA] border-b border-[#E5E7EB]">
        <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-6 text-[#6B7280]">
            <span className="flex items-center gap-2">
              <span className="font-medium text-[#002366]">Teléfono:</span>
              +51 972 719 164
            </span>
            <span className="flex items-center gap-2">
              <span className="font-medium text-[#002366]">Correo:</span>
              ventas@promelab.com
            </span>
          </div>
          <div className="flex gap-6 text-[#374151]">
            <Link href="/help" className="hover:text-[#002366] transition-colors duration-150">
              Centro de ayuda
            </Link>
            <Link href="/quote" className="hover:text-[#002366] transition-colors duration-150">
              Cotizaciones
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* LOGO — Discreto, no protagonista */}
          <Link href="/" className="flex items-center gap-2 ml-6">
            <Logo className="h-16 text-[#0f266b]" />
          </Link>

          {/* BÚSQUEDA — SIEMPRE visible (clave UX) */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <div
              className="relative w-full"
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              onFocus={() => results.length && setShowResults(true)}
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <Input
                type="search"
                placeholder="Buscar por código, marca o especificación técnica..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-10 border-[#E5E7EB] focus:border-[#00A8CC] focus:ring-1 focus:ring-[#00A8CC] transition-colors duration-150"
              />
              {showResults && (
                <div className="absolute top-full mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white shadow-sm z-50">
                  
                  {searching && (
                    <div className="px-4 py-3 text-sm text-[#6B7280]">
                      Buscando…
                    </div>
                  )}

                  {!searching && results.length === 0 && (
                    <div className="px-4 py-3 text-sm text-[#6B7280]">
                      Sin resultados
                    </div>
                  )}

                  {!searching && results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug)}
                      className="w-full text-left px-4 py-3 text-sm text-[#374151] hover:bg-[#F5F7FA] transition-colors duration-150"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* ACCIONES */}
          <div className="flex items-center gap-2">
            
            {/* USER DROPDOWN */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5F7FA] transition-colors duration-150">
                    <User className="h-4 w-4 text-[#002366]" />
                    <span className="hidden md:block text-sm font-medium text-[#374151]">
                      {user.username}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 bg-white border border-[#E5E7EB] shadow-lg">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-[#002366]">
                        {user.username}
                      </span>
                      <span className="text-xs text-[#6B7280] font-normal">
                        {user.email}
                      </span>
                      <span className="text-xs text-[#00A8CC] font-medium mt-1">
                        {user.role === "ADMIN" ? "Administrador" : 
                         user.role === "STAFF" ? "Staff" : "Cliente"}
                      </span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-[#E5E7EB]" />

                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer text-[#374151]">
                      Mi cuenta
                    </Link>
                  </DropdownMenuItem>

                  {isClient && (
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer text-[#374151]">
                        Mis órdenes
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {showAdminPanel && (
                    <>
                      <DropdownMenuSeparator className="bg-[#E5E7EB]" />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-[#002366] font-medium">
                          <LayoutDashboard size={16} />
                          Panel administrativo
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="bg-[#E5E7EB]" />

                  <DropdownMenuItem className="text-[#E5533D] cursor-pointer">
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5F7FA] transition-colors duration-150"
              >
                <User className="h-4 w-4 text-[#002366]" />
                <span className="hidden md:block text-sm font-medium text-[#374151]">
                  Ingresar
                </span>
              </Link>
            )}

            {/* CARRITO */}
            <Link
              href="/cart"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5F7FA] transition-colors duration-150"
            >
              <ShoppingCart className="h-4 w-4 text-[#002366]" />
              <span className="hidden md:block text-sm font-medium text-[#374151]">
                Carrito
              </span>
            </Link>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-[#F5F7FA] transition-colors duration-150"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-[#002366]" />
              ) : (
                <Menu className="h-5 w-5 text-[#002366]" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 h-10 border-[#E5E7EB]"
            />
          </div>
        </div>
      </div>

      {/* CATEGORÍAS — Navegación secundaria */}
      <div className="hidden md:block border-t border-[#E5E7EB] bg-[#F5F7FA]">
        <div className="container mx-auto px-4">
          <nav className="flex h-11 items-center gap-8 overflow-x-auto text-sm">
            <Link
              href="/products"
              className="whitespace-nowrap font-medium text-[#002366] hover:text-[#00A8CC] transition-colors duration-150"
            >
              Todos los productos
            </Link>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="whitespace-nowrap text-[#6B7280] hover:text-[#002366] transition-colors duration-150"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            <Link
              href="/products"
              className="block px-3 py-2 text-sm font-medium text-[#002366] hover:bg-[#F5F7FA] rounded-lg transition-colors duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              Todos los productos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="block px-3 py-2 text-sm text-[#374151] hover:bg-[#F5F7FA] rounded-lg transition-colors duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-[#E5E7EB] space-y-1">
              <Link
                href="/help"
                className="block px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F5F7FA] rounded-lg transition-colors duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                Centro de ayuda
              </Link>
              <Link
                href="/quote"
                className="block px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F5F7FA] rounded-lg transition-colors duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cotizaciones
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}