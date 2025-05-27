import type { Metadata } from "next"

import { ResetPasswordForm } from "@/features/auth/components"

export const metadata: Metadata = {
  title: "Password recovery"
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
