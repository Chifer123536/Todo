import { useState, useMemo, useEffect } from "react"
import { useTodosQuery } from "./useTodosQuery"

export const useTodoListActions = () => {
  const { data: todos = [], error, isLoading, isFetching } = useTodosQuery()
  const todosPerPage = 5

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hydrated, setHydrated] = useState<boolean>(false)

  const totalPages = Math.max(1, Math.ceil(todos.length / todosPerPage))

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentPage")
      const parsed = Number(stored)
      if (!isNaN(parsed) && parsed > 0) {
        setCurrentPage(parsed)
      }
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isFetching) {
      // Если задач стало меньше и мы были на последней странице — перейти на новую последнюю
      if (currentPage > totalPages) {
        setCurrentPage(totalPages)
      }

      // Если задач стало больше и мы были на предпоследней странице — перейти на новую последнюю
      if (
        todos.length > 0 &&
        currentPage === totalPages - 1 &&
        todos.length % todosPerPage === 1
      ) {
        setCurrentPage(totalPages)
      }
    }
  }, [todos.length, isFetching, currentPage, totalPages, todosPerPage])

  useEffect(() => {
    if (typeof window !== "undefined" && hydrated) {
      localStorage.setItem("currentPage", String(currentPage))
    }
  }, [currentPage, hydrated])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const currentTodos = useMemo(() => {
    if (!hydrated) return []
    const start = (currentPage - 1) * todosPerPage
    return todos.slice(start, start + todosPerPage)
  }, [todos, currentPage, hydrated, todosPerPage])

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
    totalPages
  }
}
