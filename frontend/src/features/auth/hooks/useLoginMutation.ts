import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import { toastMessageHandler } from "@/shared/utils";

import { TypeLoginSchema } from "../schemes";
import { authService } from "../services";

export function useLoginMutation(
  setIsShowFactor: Dispatch<SetStateAction<boolean>>,
) {
  const router = useRouter();

  const { mutate: login, isPending: isLoadingLogin } = useMutation({
    mutationKey: ["login user"],
    mutationFn: ({
      values,
      recaptcha,
    }: {
      values: TypeLoginSchema;
      recaptcha: string;
    }) => authService.login(values, recaptcha),
    onSuccess(data: any) {
      if (data.message) {
        toastMessageHandler(data);
        setIsShowFactor(true);
      } else {
        toast.success("Successful");
        router.push("/");
      }
    },
    onError(error) {
      toastMessageHandler(error);
    },
  });

  return { login, isLoadingLogin };
}
