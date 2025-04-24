import { TodoItem } from "@/widgets/TodoItem";
import { useTodoListActions } from "@/features/todo/hooks/useTodoListActions";
import { Pagination } from "@/widgets/Pagination";
import { Loader } from "@/widgets/TodoLoader";
import { ErrorMessage } from "@/widgets/ErrorMessage";

import styles from "./todoList.module.scss";

export const TodoList: React.FC = () => {
  const {
    error,
    loading,
    todosLength,
    currentTodos,
    todosPerPage,
    currentPage,
    handlePageChange,
  } = useTodoListActions();

  if (loading) {
    return <Loader isLoading={loading} />;
  }
  if (error) return <ErrorMessage />;

  return (
    <div className={styles.page}>
      <div className={styles.todoContainer}>
        {todosLength === 0 ? (
          <div className={styles.noTasks}>No tasks available</div>
        ) : (
          currentTodos.map((todo) => <TodoItem key={todo._id} todo={todo} />)
        )}
      </div>

      {todosLength > todosPerPage && (
        <Pagination
          todosLength={todosLength}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
        />
      )}
    </div>
  );
};
