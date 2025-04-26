import { TodoList } from "@/widgets/TodoList";
import { AddTodo } from "@/widgets/AddTodo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo List",
  description: "Manage your tasks",
};

export default function TodosPage() {
  return (
    <>
      <div className="layout">
        <AddTodo />
        <TodoList />
      </div>
    </>
  );
}
