import TodoItem from "../TodoItem/TodoItem";
import Pagination from "../Pagination/Pagination";
import styles from "./TodoList.module.scss";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import useTodoListActions from "../../hooks/useTodoListActions";

const TodoList: React.FC = () => {
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

export default TodoList;
