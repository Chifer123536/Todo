import { ResetPasswordForm } from "@/features/auth/components"
import { PageWrapper } from "@/shared/components/ui/PageWrapper"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Password Recovery – Todo App",
  description: "Reset your password and regain access to your tasks.",
  alternates: {
    canonical: "https://todolist.chifer123536.ru/auth/reset-password"
  },
  openGraph: {
    images: [
      {
        url: "https://todolist.chifer123536.ru/og-reset.png",
        width: 1200,
        height: 630,
        alt: "Reset Password Page"
      }
    ]
  }
}

export default function ResetPasswordPage() {
  return (
    <PageWrapper title={metadata.title?.toString()}>
      <ResetPasswordForm />
    </PageWrapper>
  )
}
