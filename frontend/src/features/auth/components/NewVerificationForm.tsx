"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Loading } from "@/shared/components/ui";

import { useVerificationMutation } from "../hooks";

import { AuthWrapper } from "./AuthWrapper";

export function NewVerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { verification } = useVerificationMutation();

  useEffect(() => {
    verification(token);
  }, [token]);

  return (
    <AuthWrapper heading="Verify your email">
      <div>
        <Loading />
      </div>
    </AuthWrapper>
  );
}

//Переход на этот компонент идёт за счёт ссылки, которую отправляет на почту сервер (в файле confirmation.template.ts).
