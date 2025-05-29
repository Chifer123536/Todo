import { type Metadata } from "next"

import { SettingsForm } from "@/features/user/components"

export const metadata: Metadata = {
  title: "Settings – Todo App",
  description: "Manage your account settings and preferences.",
  alternates: { canonical: "https://yourdomain.com/dashboard/settings" },
  openGraph: {
    images: [
      {
        url: "/og-settings.png",
        width: 1200,
        height: 630,
        alt: "Settings Page"
      }
    ]
  },
  twitter: { card: "summary_large_image", images: ["/og-settings.png"] }
}

export default function SettingsPage() {
  return <SettingsForm />
}
