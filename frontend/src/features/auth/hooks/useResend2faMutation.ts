import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/shared/api"

export const useResend2faMutation = () => {
  const { mutate: resend, isPending } = useMutation({
    mutationFn: async () => {
      return await api.post<{ message: string }>("/auth/2fa/resend")
    },
    onSuccess: (data) => {
      toast.success(data.message || "Verification code resent")
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to resend verification code"
      )
    }
  })

  return { resend, isResending: isPending }
}
