import { Metadata } from "next"
import { PageWrapper } from "@/shared/components/ui/PageWrapper"
import { UserBadge } from "@/widgets/UserBadge"
import { TodoList } from "@/widgets/TodoList"

export const metadata: Metadata = {
  title: "Your Todo List – Todo App",
  description: "View and manage your tasks in Todo App.",
  alternates: { canonical: "https://todolist.chifer123536.ru/" },
  openGraph: {
    images: [
      {
        url: "https://todolist.chifer123536.ru/og-list.png",
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
