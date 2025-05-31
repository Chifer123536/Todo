import { RegisterForm } from "@/features/auth/components"
import { PageWrapper } from "@/shared/components/ui/PageWrapper"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account – Todo App",
  description: "Sign up and start managing your tasks today.",
  alternates: { canonical: "https://yourdomain.com/auth/register" },
  openGraph: {
    images: [
      {
        url: "/og-register.png",
        width: 1200,
        height: 630,
        alt: "Register Page"
      }
    ]
  }
}

export default function RegisterPage() {
  return (
    <PageWrapper title={metadata.title?.toString()}>
      <RegisterForm />
    </PageWrapper>
  )
}
