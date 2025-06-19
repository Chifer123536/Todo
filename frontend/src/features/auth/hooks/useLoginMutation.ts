import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"

import { toastMessageHandler } from "@/shared/utils"

import { TypeLoginSchema } from "../schemes"
import { authService } from "../services"

export function useLoginMutation(
  setIsShowFactor: Dispatch<SetStateAction<boolean>>
) {
  const router = useRouter()

  const { mutate: login, isPending: isLoadingLogin } = useMutation({
    mutationKey: ["login user"],
    mutationFn: ({
      values,
      recaptcha
    }: {
      values: TypeLoginSchema
      recaptcha: string
    }) => authService.login(values, recaptcha),
    onSuccess(data: any) {
      if (data.message) {
        toast.success(data.message)
        setIsShowFactor(true)
      } else {
        toast.success("Successful")
        router.push("/")
      }
    },
    onError(error) {
      toastMessageHandler(error)
    }
  })

  const { mutate: confirm2fa, isPending: isLoading2fa } = useMutation({
    mutationKey: ["confirm 2fa"],
    mutationFn: (code: string) => authService.confirm2fa(code),
    onSuccess() {
      toast.success("2FA confirmed")
      router.push("/")
    },
    onError(error) {
      toastMessageHandler(error)
    }
  })

  return { login, confirm2fa, isLoadingLogin, isLoading2fa }
}
