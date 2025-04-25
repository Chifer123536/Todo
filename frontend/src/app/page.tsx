import { TodoList } from "@/widgets/TodoList";
import { AddTodo } from "@/widgets/AddTodo";
import { Navbar } from "@/widgets/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo List",
  description: "Manage your tasks",
};

export default function TodosPage() {
  return (
    <>
      <Navbar />
      <div className="layout">
        <AddTodo />
        <TodoList />
      </div>
    </>
  );
}
