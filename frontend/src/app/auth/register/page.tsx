import type { Metadata } from "next"

import { RegisterForm } from "@/features/auth/components"

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
  },
  twitter: { card: "summary_large_image", images: ["/og-register.png"] }
}

export default function RegisterPage() {
  return <RegisterForm />
}
