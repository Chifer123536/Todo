import { useCallback } from "react"
import { toast } from "sonner"

export const TODO_LIMIT = 999

export const useTodoValidation = () => {
  const validateTitle = useCallback((title: string): boolean => {
    if (!title.trim()) {
      toast.error("Task cannot be empty.", { id: "todo-empty" })
      return false
    }
    if (title.length > TODO_LIMIT) {
      toast.error(`Limit exceeded by -${title.length - TODO_LIMIT} chars.`, {
        id: "todo-limit"
      })
      return false
    }
    return true
  }, [])

  return { validateTitle }
}
