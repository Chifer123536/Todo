import { useState } from "react";
import { toast } from "sonner";
import {
  changeStatus,
  deleteTodo,
  editTodo,
  ITodo,
} from "@/entities/todo/model/slice";
import { useAppDispatch } from "@/shared/lib/hooks";
import { useTodoInput } from "@/shared/todo/hooks/useTodoInput";

export const useItemActions = (todo: ITodo) => {
  const dispatch = useAppDispatch();
  const {
    value: editedTitle,
    showLimitHint,
    handleChange: handleTextareaChange,
    validateTitle,
  } = useTodoInput(todo.title);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSave = async () => {
    if (!todo._id) return;
    if (!validateTitle(editedTitle)) return;

    try {
      setIsEditing(true);
      setIsModalOpen(false);
      await dispatch(editTodo({ ...todo, title: editedTitle })).unwrap();
    } catch (error) {
      console.error("Error editing todo", error);
      toast.error("Error editing todo, please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!todo._id) return;

    try {
      setIsDeleting(true);
      await dispatch(deleteTodo(todo._id)).unwrap();
    } catch (error) {
      console.error("Error deleting todo", error);
      toast.error("Error deleting todo, please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = () => {
    if (todo._id) {
      dispatch(changeStatus(todo));
    }
  };

  return {
    handleEditSave,
    handleDelete,
    handleChange,
    handleTextareaChange,
    isModalOpen,
    setIsModalOpen,
    editedTitle,
    showLimitHint,
    isEditing,
    isDeleting,
  };
};
