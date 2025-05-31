import { TodoList } from "@/widgets/TodoList"
import { UserBadge } from "@/widgets/UserBadges"
import { PageWrapper } from "@/shared/components/ui/PageWrapper"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Todo List – Todo App",
  description: "View and manage your tasks in Todo App.",
  alternates: { canonical: "https://yourdomain.com/" },
  openGraph: {
    images: [
      {
        url: "/og-list.png",
        width: 1200,
        height: 630,
        alt: "TodoList Screenshot"
      }
    ]
  }
}

export default function TodosPage() {
  return (
    <PageWrapper title={metadata.title?.toString()}>
      <div className="layout relative">
        <UserBadge />
        <TodoList />
      </div>
    </PageWrapper>
  )
}
