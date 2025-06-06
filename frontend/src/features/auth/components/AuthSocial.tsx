"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { FaGoogle, FaYandex } from "react-icons/fa"
import { toast } from "sonner"

import { Button } from "@/shared/components/ui"
import { authService } from "../services"

export function AuthSocial() {
  const router = useRouter()

  const { mutate: oauthByProvider, isPending } = useMutation({
    mutationKey: ["oauth by provider"],
    mutationFn: (provider: "google" | "yandex") =>
      authService.oauthByProvider(provider),
    onSuccess(data) {
      router.push(data.url)
    },
    onError(error: any) {
      toast.error(error.message || "OAuth error. Please register.", {
        duration: 3000
      })
      router.push("/auth/register")
    }
  })

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <Button
          onClick={() => oauthByProvider("google")}
          disabled={isPending}
          variant="outline"
        >
          <FaGoogle className="mr-2 size-4" />
          Google
        </Button>
        <Button
          onClick={() => oauthByProvider("yandex")}
          disabled={isPending}
          variant="outline"
        >
          <FaYandex className="mr-2 size-4" />
          Yandex
        </Button>
      </div>
      <div className="relative mb-2 space-y-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
    </>
  )
}
