import { Suspense } from "react"
import type { Metadata } from "next"

import { NewVerificationForm } from "@/features/auth/components"

export const metadata: Metadata = {
  title: "Email Confirmation – Todo App",
  description: "Confirm your email address to activate your account.",
  alternates: { canonical: "https://yourdomain.com/auth/new-verification" },
  openGraph: {
    images: [
      {
        url: "/og-new-verification.png",
        width: 1200,
        height: 630,
        alt: "Email Confirmation Page"
      }
    ]
  },
  twitter: { card: "summary_large_image", images: ["/og-new-verification.png"] }
}

export default function NewVerificationPage() {
  return (
    <Suspense fallback={null}>
      <NewVerificationForm />
    </Suspense>
  )
}
