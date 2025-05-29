import type { Metadata } from "next"

import { LoginForm } from "@/features/auth/components"

export const metadata: Metadata = {
  title: "Login – Todo App",
  description: "Access your account and manage your tasks.",
  alternates: { canonical: "https://yourdomain.com/auth/login" },
  openGraph: {
    images: [
      { url: "/og-login.png", width: 1200, height: 630, alt: "Login Page" }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-login.png"]
  }
}

export default function LoginPage() {
  return <LoginForm />
}
