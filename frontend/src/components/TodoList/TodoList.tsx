import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useEffect, useState, useMemo } from "react";
import { getTodos } from "../../Redux/Slices/todoSlice";
import TodoItem from "../TodoItem/TodoItem";
import Pagination from "../Pagination/Pagination";
import styles from "./TodoList.module.scss";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const TodoList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { error, todos, loading, todosLength } = useSelector(
    (state: RootState) => state.todos
  );

  const todosPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(
    Number(localStorage.getItem("currentPage")) || 1
  );
  const [prevTodosLength, setPrevTodosLength] = useState(todosLength);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  useEffect(() => {
    const lastPage = Math.ceil(todosLength / todosPerPage);

    if (prevTodosLength !== 0) {
      // Стало больше задач
      if (todosLength > prevTodosLength && currentPage === lastPage - 1) {
        setCurrentPage(lastPage);
        localStorage.setItem("currentPage", lastPage.toString());
      }
      // Стало меньше задач
      else if (todosLength < prevTodosLength && currentPage > lastPage) {
        setCurrentPage(lastPage);
        localStorage.setItem("currentPage", lastPage.toString());
      }
    }

    setPrevTodosLength(todosLength);
  }, [todosLength, currentPage, prevTodosLength]);

  // Сохранение текущей страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page.toString());
  };

  //  это подмассив из todos, который отображает задачи текущей странице.
  const currentTodos = useMemo(() => {
    const start = (currentPage - 1) * todosPerPage;
    const end = currentPage * todosPerPage;
    return todos.slice(start, end);
  }, [todos, currentPage]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.todoContainer}>
        {!loading && todosLength === 0 ? (
          <div className={styles.noTasks}>No tasks available</div>
        ) : (
          currentTodos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} loading={loading} />
          ))
        )}
      </div>

      {/* Пагинация */}
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
