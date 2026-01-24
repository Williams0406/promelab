// src/middleware.js
import { NextResponse } from "next/server";

/**
 * ============================
 * CONFIG
 * ============================
 */
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/products",
  "/product",
];

const ADMIN_BASE = "/admin";
const CLIENT_BASE = ["/cart", "/orders", "/checkout"];

/**
 * ============================
 * HELPERS
 * ============================
 */
const isPublicRoute = (pathname) =>
  PUBLIC_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

const isAdminRoute = (pathname) =>
  pathname.startsWith(ADMIN_BASE);

const isClientRoute = (pathname) =>
  CLIENT_BASE.some((base) =>
    pathname.startsWith(base)
  );

/**
 * ============================
 * MIDDLEWARE
 * ============================
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Permitir archivos estáticos y API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Obtener token de cookies
  const token = request.cookies.get("access_token")?.value;

  // Rutas públicas → siempre permitir
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Sin token → redirigir a login
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Admin → token requerido
  if (isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  // Cliente → token requerido
  if (isClientRoute(pathname)) {
    return NextResponse.next();
  }

  // Cualquier otra ruta → permitir
  return NextResponse.next();
}

/**
 * ============================
 * MATCHER
 * ============================
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
