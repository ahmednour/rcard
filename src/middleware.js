import { NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const protectedRoutes = ["/invitation", "/admin"];
const publicRoutes = ["/login", "/admin/login"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Handle incorrect route /ar/page/ar
  if (path === "/ar/page/ar") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Check for public routes first
  const isPublicRoute = publicRoutes.some(
    (route) => path === route || path.startsWith(route + "/")
  );

  // Only consider protected if it's not already a public route
  const isProtectedRoute =
    !isPublicRoute &&
    protectedRoutes.some(
      (route) => path === route || path.startsWith(route + "/")
    );

  // Define admin routes (excluding admin login)
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";

  // Only process session for routes that need it
  if (isProtectedRoute || isPublicRoute) {
    try {
      const cookie = req.cookies.get("session")?.value;
      const session = await decrypt(cookie);

      // Handle protected routes that require auth
      if (isProtectedRoute && !session?.userId) {
        // Redirect to different login pages based on the route
        if (path.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
        } else {
          return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
      }

      // Check if user has admin role when accessing admin routes
      if (isAdminRoute && session?.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
      }

      // Handle redirects for logged-in users on public routes
      if (isPublicRoute && session?.userId) {
        if (path === "/admin/login" && session?.role === "admin") {
          return NextResponse.redirect(new URL("/admin", req.nextUrl));
        } else if (path === "/login") {
          return NextResponse.redirect(new URL("/invitation", req.nextUrl));
        }
      }
    } catch (error) {
      console.error("Middleware session error:", error.message);
      // On session error, redirect protected routes to login
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
      } else if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
      }
    }
  }

  return NextResponse.next();
}
