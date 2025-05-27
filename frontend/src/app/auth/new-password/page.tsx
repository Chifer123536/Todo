import { Suspense } from "react"
import type { Metadata } from "next"

import { NewPasswordForm } from "@/features/auth/components"

export const metadata: Metadata = {
  title: "New password"
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={null}>
      <NewPasswordForm />
    </Suspense>
  )
}
