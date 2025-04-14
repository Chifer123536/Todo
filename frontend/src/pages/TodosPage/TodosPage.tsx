import { TodoList } from "@/widgets/TodoList";
import { AddTodo } from "@/widgets/AddTodo";
import { Navbar } from "@/widgets/Navbar";

export const TodosPage = () => {
  return (
    <>
      <Navbar />
      <div className="layout">
        <AddTodo />
        <TodoList />
      </div>
    </>
  );
};
