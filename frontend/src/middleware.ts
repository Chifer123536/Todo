import { type NextRequest, NextResponse } from "next/server"

export default function middleware(request: NextRequest) {
  const { url, cookies } = request

  const session = cookies.get("session")?.value
  const isAuthPage = url.includes("/auth")

  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL("/", url))
    }
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", url))
  }
}

export const config = {
  matcher: ["/auth/:path*", "/"]
}
