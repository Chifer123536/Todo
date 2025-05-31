import { LoginForm } from "@/features/auth/components"
import { PageWrapper } from "@/shared/components/ui/PageWrapper"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login – Todo App",
  description: "Access your account and manage your tasks.",
  alternates: { canonical: "https://yourdomain.com/auth/login" },
  openGraph: {
    images: [
      { url: "/og-login.png", width: 1200, height: 630, alt: "Login Page" }
    ]
  }
}

export default function LoginPage() {
  return (
    <PageWrapper title={metadata.title?.toString()}>
      <LoginForm />
    </PageWrapper>
  )
}
