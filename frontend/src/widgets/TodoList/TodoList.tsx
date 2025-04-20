import { TodoItem } from "@/features/todo/TodoItem";
import { useTodoListActions } from "@/features/todo/TodoList";

import { Pagination } from "@/shared/todo/ui/Pagination";
import { Loader } from "@/widgets/Loader";
import { ErrorMessage } from "@/widgets/ErrorMessage";

import styles from "./todoList.module.scss";

export const TodoList: React.FC = () => {
  const {
    firstLoading,
    error,
    loading,
    todosLength,
    currentTodos,
    todosPerPage,
    currentPage,
    handlePageChange,
  } = useTodoListActions();

  if (firstLoading) {
    return <Loader />;
  }

  if (error) return <ErrorMessage />;

  return (
    <div className={styles.page}>
      <div className={styles.todoContainer}>
        {!loading && todosLength === 0 ? (
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
