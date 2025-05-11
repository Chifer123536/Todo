import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { toastMessageHandler } from "@/shared/utils";

import { TypeSettingsSchema } from "../schemes";
import { userService } from "../services";

export function useUpdateProfileMutation() {
  const { mutate: update, isPending: isLoadingUpdate } = useMutation({
    mutationKey: ["update profile"],
    mutationFn: (data: TypeSettingsSchema) => userService.updateProfile(data),
    onSuccess() {
      toast.success("Profile successfully updated.");
    },
    onError(error) {
      toastMessageHandler(error);
    },
  });

  return { update, isLoadingUpdate };
}
