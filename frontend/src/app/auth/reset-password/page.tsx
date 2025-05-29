import type { Metadata } from "next"

import { ResetPasswordForm } from "@/features/auth/components"

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
  },
  twitter: { card: "summary_large_image", images: ["/og-reset.png"] }
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
