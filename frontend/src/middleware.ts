import { NextRequest, NextResponse } from "next/server"

export default function middleware(request: NextRequest) {
  console.log(`[MIDDLEWARE] URL: ${request.url}`)
  console.log(`[MIDDLEWARE] Cookies:`, JSON.stringify(request.cookies.getAll()))

  const session = request.cookies.get("session")?.value
  const authState = request.cookies.get("authState")?.value // 'pending2FA' или 'authenticated'
  const path = request.nextUrl.pathname
  const isAuthPage = path.startsWith("/auth")
  // Нет отдельной /auth/2fa, используем /auth/login для ввода кода
  const loginPage = path === "/auth/login"

  if (isAuthPage) {
    if (session && authState !== "pending2FA") {
      // есть сессия и НЕ pending2FA → редирект на /
      console.log(
        "[MIDDLEWARE] Redirect to / because authenticated or no 2FA pending"
      )
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (session && authState === "pending2FA") {
      // ждём 2FA: разрешаем оставаться на странице логина, чтобы показать поле кода
      if (loginPage) {
        console.log(
          "[MIDDLEWARE] Allow pending2FA on /auth/login to input code"
        )
        return NextResponse.next()
      }
      // Если пытается зайти на другие /auth/* (например /auth/register), можно позволить или редиректить на /auth/login:
      console.log("[MIDDLEWARE] Redirect pending2FA to /auth/login")
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    // нет сессии → разрешаем страницы /auth/login, /auth/register и т.п.
    console.log("[MIDDLEWARE] Allowing auth page without session")
    return NextResponse.next()
  }

  // Для прочих (защищённых) путей:
  if (!session) {
    console.log("[MIDDLEWARE] Redirect to /auth/login because no session")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  if (session && authState === "pending2FA") {
    console.log("[MIDDLEWARE] Redirect to /auth/login because pending2FA")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  // session + (authState==='authenticated' или нет authState cookie) → пускаем
  console.log("[MIDDLEWARE] Session exists and not pending2FA, continue")
  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/:path*", "/todos/:path*", "/users/:path*", "/"]
}
