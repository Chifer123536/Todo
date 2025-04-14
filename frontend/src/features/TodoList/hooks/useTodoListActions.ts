import { useEffect, useState, useMemo, useRef } from "react";

import { getTodos } from "@/entities/todo/model/slice";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";

export const useTodoListActions = () => {
  const dispatch = useAppDispatch();
  const { error, todos, loading, todosLength, initialLoading } = useAppSelector(
    (state) => state.todos,
  );

  const todosPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(
    () => Number(localStorage.getItem("currentPage")) || 1,
  );
  const [prevTodosLength, setPrevTodosLength] = useState(0);
  const didMountRef = useRef(false);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const lastPage = Math.max(1, Math.ceil(todosLength / todosPerPage));

    // Если мы на предпоследней странице, переходим на последнюю
    if (
      prevTodosLength !== 0 &&
      todosLength > prevTodosLength &&
      currentPage === lastPage - 1
    ) {
      setCurrentPage(lastPage);
      localStorage.setItem("currentPage", lastPage.toString());
    }

    // Если текущая страница больше последней допустимой
    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
      localStorage.setItem("currentPage", lastPage.toString());
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
    firstLoading: initialLoading,
    handlePageChange,
    todosPerPage,
    currentPage,
  };
};
