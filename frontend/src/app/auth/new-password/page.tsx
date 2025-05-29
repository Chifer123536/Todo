import { Suspense } from "react"
import type { Metadata } from "next"

import { NewPasswordForm } from "@/features/auth/components"

export const metadata: Metadata = {
  title: "Set New Password – Todo App",
  description: "Choose a new password for your account.",
  alternates: { canonical: "https://yourdomain.com/auth/new-password" },
  openGraph: {
    images: [
      {
        url: "/og-new-password.png",
        width: 1200,
        height: 630,
        alt: "New Password Page"
      }
    ]
  },
  twitter: { card: "summary_large_image", images: ["/og-new-password.png"] }
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={null}>
      <NewPasswordForm />
    </Suspense>
  )
}
