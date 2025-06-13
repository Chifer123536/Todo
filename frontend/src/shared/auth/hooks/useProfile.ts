"use client"

import { usePathname, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useEffect } from "react"

import { userService } from "@/features/user/services"
import { IUser } from "@/features/auth/types"

export function useProfile() {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const skipFetch = pathname.startsWith("/auth")

  // Удаляем флаг при заходе на страницы авторизации (после успешного входа)
  useEffect(() => {
    if (pathname.startsWith("/auth")) {
      sessionStorage.removeItem("has-redirected")
    }
  }, [pathname])

  const query = useQuery<IUser, AxiosError>({
    queryKey: ["profile"],
    queryFn: () => userService.findProfile(),
    enabled: !skipFetch,
    retry: false
  })

  useEffect(() => {
    const hasRedirected = sessionStorage.getItem("has-redirected")

    if (
      query.error?.response?.status === 401 &&
      !pathname.startsWith("/auth") &&
      hasRedirected !== "true"
    ) {
      sessionStorage.setItem("has-redirected", "true")
      queryClient.removeQueries({ queryKey: ["profile"] })
      router.push("/auth/login")
    }
  }, [query.error, pathname, queryClient, router])

  return {
    data: query.data,
    isLoading: query.isLoading
  }
}

/*
 - Запрашивает данные текущего пользователя (GET /users/profile) через React Query.
 - Отключает запрос на страницах /auth/*, чтобы не выполнять лишние вызовы при входе/регистрации.
 - При получении 401 Unauthorized:
    • очищает кэш профиля,
    • делает редирект на /auth/login,
    • и сохраняет флаг в sessionStorage, чтобы избежать бесконечных редиректов на этой вкладке.
 - При заходе на /auth/* автоматически сбрасывает флаг "has-redirected", чтобы редиректы снова работали после повторного входа.
 - Возвращает { data, isLoading } для использования в компонентах (например, отображение аватара пользователя).
 */
