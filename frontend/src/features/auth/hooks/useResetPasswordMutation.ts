import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessageHandler } from "@/shared/utils";

import { TypeResetPasswordSchema } from "../schemes/reset-password.schema";
import { passwordRecoveryService } from "../services/password-recovery.service";

export function useResetPasswordMutation() {
  const { mutate: reset, isPending: isLoadingReset } = useMutation({
    mutationKey: ["reset password"],
    mutationFn: ({
      values,
      recaptcha,
    }: {
      values: TypeResetPasswordSchema;
      recaptcha: string;
    }) => passwordRecoveryService.reset(values, recaptcha),
    onSuccess() {
      toast.success("Check your email", {
        description: "Confirmation link has been sent to your email.",
        duration: 3000,
      });
    },
    onError(error) {
      toastMessageHandler(error);
    },
  });

  return { reset, isLoadingReset };
}
