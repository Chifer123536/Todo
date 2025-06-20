import { SettingsForm } from "@/features/user/components"
import { PageWrapper } from "@/shared/components/ui/PageWrapper"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings – Todo App",
  description: "Manage your account settings and preferences.",
  alternates: {
    canonical: "https://todolist.chifer123536.ru/dashboard/settings"
  },
  openGraph: {
    images: [
      {
        url: "https://todolist.chifer123536.ru/og-settings.png",
        width: 1200,
        height: 630,
        alt: "Settings Page"
      }
    ]
  }
}

export default function SettingsPage() {
  return (
    <PageWrapper title={metadata.title?.toString()}>
      <SettingsForm />
    </PageWrapper>
  )
}
