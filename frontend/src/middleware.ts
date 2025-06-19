// middleware.ts (Next.js)

import { NextRequest, NextResponse } from "next/server"

export default function middleware(req: NextRequest) {
  console.log(`[MIDDLEWARE] URL: ${req.url}`)
  console.log(`[MIDDLEWARE] Cookies:`, JSON.stringify(req.cookies.getAll()))

  const isAuth = req.nextUrl.pathname.startsWith("/auth")
  const authed = req.cookies.get("authenticated")?.value === "true"

  if (isAuth) {
    if (authed) {
      console.log("[MIDDLEWARE] Redirecting to /, already authenticated")
      return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next()
  }

  if (!authed) {
    console.log("[MIDDLEWARE] Redirecting to /auth/login, not authenticated")
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/:path*", "/"]
}
