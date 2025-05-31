import { ResetPasswordForm } from "@/features/auth/components"
import { PageWrapper } from "@/shared/components/ui/PageWrapper"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Password Recovery – Todo App",
  description: "Reset your password and regain access to your tasks.",
  alternates: { canonical: "https://yourdomain.com/auth/reset-password" },
  openGraph: {
    images: [
      {
        url: "/og-reset.png",
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
