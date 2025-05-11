import { useState, useMemo, useEffect } from "react";
import { useTodosQuery } from "./useTodosQuery";

export const useTodoListActions = () => {
  const { data: todos = [], error, isLoading, isFetching } = useTodosQuery();
  const todosPerPage = 5;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hydrated, setHydrated] = useState<boolean>(false);

  const totalPages = Math.max(1, Math.ceil(todos.length / todosPerPage));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentPage");
      const parsed = Number(stored);
      if (!isNaN(parsed) && parsed > 0) {
        setCurrentPage(parsed);
      }
      setHydrated(true); // только после чтения localStorage
    }
  }, []);

  useEffect(() => {
    if (!isFetching && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [todos.length, isFetching]);

  useEffect(() => {
    if (typeof window !== "undefined" && hydrated) {
      localStorage.setItem("currentPage", String(currentPage));
    }
  }, [currentPage, hydrated]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentTodos = useMemo(() => {
    if (!hydrated) return [];
    const start = (currentPage - 1) * todosPerPage;
    return todos.slice(start, start + todosPerPage);
  }, [todos, currentPage, hydrated]);

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
