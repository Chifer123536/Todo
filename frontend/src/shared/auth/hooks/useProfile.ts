"use client"

import { usePathname, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { userService } from "@/features/user/services"
import { IUser } from "@/features/auth/types"

export function useProfile() {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const skipFetch = pathname.startsWith("/auth")

  const query = useQuery<IUser, AxiosError>({
    queryKey: ["profile"],
    queryFn: () => userService.findProfile(),
    enabled: !skipFetch,
    retry: false
  })

  if (query.error) {
    const error = query.error
    if (error.response?.status === 401 && !pathname.startsWith("/auth")) {
      queryClient.removeQueries({ queryKey: ["profile"] })
      router.push("/auth/login")
    }
  }

  return {
    data: query.data,
    isLoading: query.isLoading
  }
}

/*
 - Запрашивает данные текущего пользователя (GET /users/profile).
 - Отключает запрос на страницах /auth/* (login/registration), чтобы избежать лишних вызовов.
 - При ошибке 401 очищает кэш профиля и делает редирект на /auth/login.
 - Возвращает { data, isLoading } для использования в компонентах. 
 */
