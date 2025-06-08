import { NextRequest, NextResponse } from "next/server"

export default function middleware(request: NextRequest) {
  console.log(`[MIDDLEWARE] URL: ${request.url}`)
  console.log(`[MIDDLEWARE] Cookies:`, JSON.stringify(request.cookies.getAll()))

  const session = request.cookies.get("session")?.value
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")

  if (isAuthPage) {
    if (session) {
      console.log("[MIDDLEWARE] Redirect to / because user already has session")
      return NextResponse.redirect(new URL("/", request.url))
    }
    console.log("[MIDDLEWARE] Allowing auth page without session")
    return NextResponse.next()
  }

  if (!session) {
    console.log("[MIDDLEWARE] Redirect to /auth/login because no session")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  console.log("[MIDDLEWARE] Session exists, continue")
  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/:path*", "/"]
}
