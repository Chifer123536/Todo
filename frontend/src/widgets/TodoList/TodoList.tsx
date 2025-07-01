"use client"

import { useEffect, useState } from "react"
import { TodoItem } from "@/widgets/TodoItem"
import { useTodoListActions } from "@/features/todo/hooks/useTodoListActions"
import { Pagination } from "@/widgets/Pagination"
import { Loader } from "@/widgets/TodoLoader"
import { ErrorMessage } from "@/widgets/ErrorMessage"
import styles from "./TodoList.module.scss"
import { AddTodo } from "../AddTodo"

interface TodoListProps {
  onReady?: () => void
}

export const TodoList: React.FC<TodoListProps> = ({ onReady }) => {
  const {
    error,
    loading,
    todosLength,
    currentTodos,
    todosPerPage,
    currentPage,
    handlePageChange
  } = useTodoListActions()

  const [initialLoading, setInitialLoading] = useState(true)
  const [tooLongLoading, setTooLongLoading] = useState(false)

  useEffect(() => {
    if (!loading) {
      setInitialLoading(false)
    }
  }, [loading])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) setTooLongLoading(true)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [loading])

  useEffect(() => {
    if (!initialLoading && !loading && !error) {
      onReady?.()
    }
  }, [initialLoading, loading, error, onReady])

  if (tooLongLoading) return <ErrorMessage />
  if (initialLoading || loading) return <Loader isLoading={true} />
  if (error) return <ErrorMessage />

  return (
    <div className={styles.page}>
      <AddTodo
        handlePageChange={handlePageChange}
        todosPerPage={todosPerPage}
        todosLength={todosLength}
      />
      <div className={styles.todoContainer}>
        {todosLength === 0 ? (
          <div className={styles.noTasks}>No tasks available</div>
        ) : (
          currentTodos.map((todo) => (
            <TodoItem key={todo.clientId ?? todo._id} todo={todo} />
          ))
        )}
      </div>
      {todosLength > todosPerPage && (
        <Pagination
          todosLength={todosLength}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          todosPerPage={todosPerPage}
        />
      )}
    </div>
  )
}
