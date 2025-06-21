import { useState, useEffect, useMemo, useRef } from "react"
import { useTodosQuery } from "./useTodosQuery"

export const useTodoListActions = () => {
  const { data: todos = [], error, isLoading, isFetching } = useTodosQuery()
  const todosPerPage = 5

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hydrated, setHydrated] = useState(false)

  const prevLengthRef = useRef<number>(todos.length)
  const initialLoadRef = useRef<boolean>(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("currentPage")
      const storedPage = raw !== null ? Number(raw) : NaN
      if (!isNaN(storedPage) && storedPage > 0) {
        setCurrentPage(storedPage)
      } else {
        setCurrentPage(1)
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return
    localStorage.setItem("currentPage", String(currentPage))
  }, [currentPage, hydrated])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(todos.length / todosPerPage))
  }, [todos.length])

  useEffect(() => {
    if (!hydrated) return
    if (isFetching) return

    const prevLength = prevLengthRef.current
    const newLength = todos.length
    const prevTotalPages = Math.max(1, Math.ceil(prevLength / todosPerPage))

    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }

    if (
      !initialLoadRef.current &&
      newLength > prevLength &&
      totalPages > prevTotalPages &&
      currentPage === prevTotalPages
    ) {
      setCurrentPage(totalPages)
    }

    if (newLength < prevLength && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }

    if (initialLoadRef.current) {
      initialLoadRef.current = false
    }
    prevLengthRef.current = newLength
  }, [todos.length, isFetching, totalPages, currentPage, hydrated])

  const currentTodos = useMemo(() => {
    if (!hydrated) return []
    if (isFetching) return []
    const start = (currentPage - 1) * todosPerPage
    const end = start + todosPerPage
    return todos.slice(start, end)
  }, [todos, currentPage, hydrated, isFetching])

  const handlePageChange = (page: number) => {
    setCurrentPage((prev) => (prev !== page ? page : prev))
  }

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

/*
  - Хук useTodoListActions для React-компонентов:
    • Получает список задач через useTodosQuery.
    • Хранит и гидрирует номер текущей страницы (currentPage) из localStorage.
    • Сохраняет currentPage в localStorage при изменении, после гидрации.
    • Вычисляет общее число страниц (totalPages) по количеству задач и todosPerPage = 5.
    • Корректирует currentPage вниз, если после удаления задач или при гидрации сохранённая страница больше существующих страниц.
    • Выполняет автопереход на новую страницу при добавлении задачи, если пользователь находился на последней странице (после initial load).
    • Возвращает:
       - error, loading, refreshing для статусов запроса;
       - todos и todosLength;
       - currentTodos для текущей страницы;
       - handlePageChange для ручного переключения страниц;
       - currentPage, todosPerPage, totalPages.
*/
