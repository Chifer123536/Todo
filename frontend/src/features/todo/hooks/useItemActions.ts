"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ITodo } from "@/shared/todo/types"
import { useTodoInput } from "@/shared/todo/hooks/useTodoInput"
import { useUpdateTodoMutation } from "./useUpdateTodoMutation"
import { useRemoveTodoMutation } from "./useRemoveTodoMutation"
import { useTodoValidation } from "@/shared/todo/hooks/useTodoValidation"

export const useItemActions = (todo: ITodo) => {
  const {
    value: editedTitle,
    showLimitHint,
    handleChange: handleTextareaChange
  } = useTodoInput(todo.title)

  const { validateTitle } = useTodoValidation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const updateTodoMutation = useUpdateTodoMutation()
  const removeTodoMutation = useRemoveTodoMutation()

  const handleEditSave = async () => {
    if (!todo._id) return
    if (!validateTitle(editedTitle)) return

    try {
      setIsEditing(true)
      setIsModalOpen(false)
      await updateTodoMutation.mutateAsync({ ...todo, title: editedTitle })
    } catch (error) {
      console.error("Error editing todo", error)
      toast.error("Error editing todo, please try again.")
    } finally {
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (!todo._id) return

    try {
      setIsDeleting(true)
      await removeTodoMutation.mutateAsync(todo._id)
    } catch (error) {
      console.error("Error deleting todo", error)
      toast.error("Error deleting todo, please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleChange = () => {
    if (!todo._id) return
    updateTodoMutation.mutate({ ...todo, completed: !todo.completed })
  }

  return {
    handleEditSave,
    handleDelete,
    handleChange,
    handleTextareaChange,
    editedTitle,
    showLimitHint,
    isModalOpen,
    setIsModalOpen,
    isEditing,
    isDeleting
  }
}
