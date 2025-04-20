import { TodoList } from "@/widgets/TodoList";
import { AddTodo } from "@/widgets/AddTodo";
import { Navbar } from "@/widgets/Navbar";
import { Helmet } from "react-helmet-async";

export const TodosPage = () => {
  return (
    <>
      <Helmet>
        <title>Todo List</title>
        <meta name="description" content="Manage your tasks" />
      </Helmet>

      <Navbar />
      <div className="layout">
        <AddTodo />
        <TodoList />
      </div>
    </>
  );
};
