import { Suspense } from "react"
import type { Metadata } from "next"
import { NewVerificationForm } from "@/features/auth/components"

export const metadata: Metadata = {
  title: "Email Confirmation – Todo App",
  description: "Confirm your email address to activate your account.",
  alternates: {
    canonical: "https://todolist.chifer123536.ru/auth/new-verification"
  },
  openGraph: {
    images: [
      {
        url: "https://todolist.chifer123536.ru/og-new-verification.png",
        width: 1200,
        height: 630,
        alt: "Email Confirmation Page"
      }
    ]
  }
}

export default function NewVerificationPage() {
  return (
    <Suspense fallback={null}>
      <NewVerificationForm />
    </Suspense>
  )
}
