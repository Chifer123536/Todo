import { useState, useMemo, useEffect } from "react";
import { useTodosQuery } from "./useTodosQuery";

export const useTodoListActions = () => {
  const { data: todos = [], error, isLoading, isFetching } = useTodosQuery();
  const todosPerPage = 5;

  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const stored = localStorage.getItem("currentPage");
    if (stored) {
      const page = Number(stored);
      if (!isNaN(page)) setCurrentPage(page);
    }
  }, []);

  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(todos.length / todosPerPage));
    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
      localStorage.setItem("currentPage", String(lastPage));
    }
  }, [todos.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", String(page));
  };

  const currentTodos = useMemo(() => {
    const start = (currentPage - 1) * todosPerPage;
    return todos.slice(start, start + todosPerPage);
  }, [todos, currentPage]);

  useEffect(() => {
    if (!isFetching && todos.length > 0) {
      const lastPage = Math.ceil(todos.length / todosPerPage);
      setCurrentPage(lastPage);
      localStorage.setItem("currentPage", String(lastPage));
    }
  }, [isFetching, todos.length]);

  return {
    error,
    loading: isLoading,
    refreshing: isFetching,
    todos,
    todosLength: todos.length,
    currentTodos,
    handlePageChange,
    currentPage,
    todosPerPage,
  };
};
