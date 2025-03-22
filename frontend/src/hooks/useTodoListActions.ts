import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { getTodos } from "../Redux/Slices/todoSlice";

const useTodoListActions = () => {
  const dispatch: AppDispatch = useDispatch();
  const { error, todos, loading, todosLength } = useSelector(
    (state: RootState) => state.todos
  );

  const todosPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(
    Number(localStorage.getItem("currentPage")) || 1
  );
  const [prevTodosLength, setPrevTodosLength] = useState(todosLength);
  const firstLoading = useSelector(
    (state: RootState) => state.todos.initialLoading
  );

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  useEffect(() => {
    const lastPage = Math.ceil(todosLength / todosPerPage);

    if (prevTodosLength !== 0) {
      if (todosLength > prevTodosLength && currentPage === lastPage - 1) {
        setCurrentPage(lastPage);
        localStorage.setItem("currentPage", lastPage.toString());
      } else if (todosLength < prevTodosLength && currentPage > lastPage) {
        setCurrentPage(lastPage);
        localStorage.setItem("currentPage", lastPage.toString());
      }
    }

    setPrevTodosLength(todosLength);
  }, [todosLength, currentPage, prevTodosLength]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page.toString());
  };

  const currentTodos = useMemo(() => {
    const start = (currentPage - 1) * todosPerPage;
    const end = currentPage * todosPerPage;
    return todos.slice(start, end);
  }, [todos, currentPage]);
  return {
    error,
    todos,
    loading,
    todosLength,
    currentTodos,
    firstLoading,
    handlePageChange,
    todosPerPage,
    currentPage,
  };
};

export default useTodoListActions;
