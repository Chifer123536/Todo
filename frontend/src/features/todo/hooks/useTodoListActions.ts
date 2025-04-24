import { useState, useMemo, useEffect } from "react";
import { useTodosQuery } from "./useTodosQuery";

export const useTodoListActions = () => {
  const { data: todos = [], error, isLoading, isFetching } = useTodosQuery();

  const todosPerPage = 5;

  const [currentPage, setCurrentPage] = useState<number>(
    () => Number(localStorage.getItem("currentPage")) || 1,
  );

  // Последняя страница вычисляется динамически
  const lastPage = Math.max(1, Math.ceil(todos.length / todosPerPage));

  useEffect(() => {
    // Если текущая страница больше, чем возможная
    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
      localStorage.setItem("currentPage", lastPage.toString());
    }
  }, [todos.length, currentPage, lastPage]);

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
    loading: isLoading,
    refreshing: isFetching,
    todosLength: todos.length,
    currentTodos,
    handlePageChange,
    currentPage,
    todosPerPage,
  };
};
