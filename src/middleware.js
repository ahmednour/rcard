import { NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const protectedRoutes = ["/invitation"];
const publicRoutes = ["/login"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Handle incorrect route /ar/page/ar
  if (path === "/ar/page/ar") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Only process session for routes that need it
  if (isProtectedRoute || isPublicRoute) {
    try {
      const cookie = req.cookies.get("session")?.value;
      const session = await decrypt(cookie);

      if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
      }

      if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL("/invitation", req.nextUrl));
      }
    } catch (error) {
      console.error("Middleware session error:", error.message);
      // On session error, redirect protected routes to login
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
      }
    }
  }

  return NextResponse.next();
}
