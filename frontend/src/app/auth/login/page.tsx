import type { Metadata } from "next"

import { LoginForm } from "@/features/auth/components"

export const metadata: Metadata = {
  title: "Enter your account"
}

export default function LoginPage() {
  return <LoginForm />
}
