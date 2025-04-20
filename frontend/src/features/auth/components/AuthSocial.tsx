import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaYandex } from "react-icons/fa";
import { Button } from "@/shared/auth/components/ui";
import { authService } from "../services";

export function AuthSocial() {
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationKey: ["oauth by provider"],
    mutationFn: async (provider: "google" | "yandex") =>
      await authService.oauthByProvider(provider),
  });

  const onClick = async (provider: "google" | "yandex") => {
    const response = await mutateAsync(provider);
    if (response) {
      navigate(response.url);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => onClick("google")}>
        <FaGoogle />
      </Button>
      <Button onClick={() => onClick("yandex")}>
        <FaYandex />
      </Button>
    </div>
  );
}
