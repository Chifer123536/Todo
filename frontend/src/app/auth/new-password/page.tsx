import { Suspense } from "react"
import { NewPasswordForm } from "@/features/auth/components"
import { PageWrapper } from "@/shared/components/ui/PageWrapper"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Set New Password – Todo App",
  description: "Choose a new password for your account.",
  alternates: {
    canonical: "https://todolist.chifer123536.ru/auth/new-password"
  },
  openGraph: {
    images: [
      {
        url: "https://todolist.chifer123536.ru/og-new-password.png",
        width: 1200,
        height: 630,
        alt: "New Password Page"
      }
    ]
  }
}

export default function NewPasswordPage() {
  return (
    <PageWrapper title={metadata.title?.toString()}>
      <Suspense fallback={null}>
        <NewPasswordForm />
      </Suspense>
    </PageWrapper>
  )
}
