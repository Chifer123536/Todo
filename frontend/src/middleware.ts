import { NextRequest, NextResponse } from "next/server"

export default function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value
  const authState = request.cookies.get("authState")?.value
  const path = request.nextUrl.pathname
  const isAuthPage = path.startsWith("/auth")
  const loginPage = path === "/auth/login"

  if (isAuthPage) {
    if (session && authState === "authenticated") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (session && authState === "pending2FA") {
      if (loginPage) return NextResponse.next()
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    return NextResponse.next()
  }

  // Остальные маршруты: если нет session или authState !== 'authenticated' — редиректим
  if (!session || authState !== "authenticated") {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/:path*", "/todos/:path*", "/users/:path*", "/"]
}

/*
- Middleware для обработки авторизации и маршрутов приложения.
- Основан на двух куках: "session" и "authState" (значения: 'authenticated', 'pending2FA').
- Поведение:
   • /auth/*:
      — session + authState === 'authenticated' → редирект на /
      — session + authState === 'pending2FA' → разрешён только /auth/login
      — остальные случаи (нет сессии) → разрешены
   • Остальные маршруты (/todos, /users и т.д.):
      — если session нет или authState !== 'authenticated' → редирект на /auth/login
      — иначе доступ разрешён
- Исключает частичный вход (висячие сессии или пропущенный 2FA).
- Гарантирует, что пользователь может попасть в приложение только при полной авторизации.
*/
