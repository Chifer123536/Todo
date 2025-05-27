import { TodoList } from "@/widgets/TodoList"
import { Metadata } from "next"
import { UserBadge } from "@/widgets/UserBadges"

export const metadata: Metadata = {
  title: "Todo List",
  description: "Manage your tasks"
}

export default function TodosPage() {
  return (
    <>
      <div className="layout relative">
        <UserBadge />
        <TodoList />
      </div>
    </>
  )
}
