import { TodoItem } from "@/features/TodoItem";
import { useTodoListActions } from "@/features/TodoList";

import { Pagination } from "@/shared/ui/Pagination";
import { Loader } from "@/widgets/Loader";
import { ErrorMessage } from "@/widgets/ErrorMessage";

import styles from "./TodoList.module.scss";

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
