import { useState } from "react";
import {
  changeStatus,
  deleteTodo,
  editTodo,
  ITodo,
} from "@/entities/todo/model/slice";
import { useAppDispatch } from "@/shared/lib/hooks";
import { TODO_LIMIT } from "@/features/todo/OverflowMessage/model/slice";

export const useItemActions = (
  todo: ITodo,
  showMessage: (msg: string) => void,
) => {
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [showLimitHint, setShowLimitHint] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSave = async () => {
    if (!todo._id) return;

    if (!editedTitle.trim()) {
      showMessage("Task cannot be empty.");
      return;
    }

    if (editedTitle.length > TODO_LIMIT) {
      showMessage(`Limit exceeded -${editedTitle.length - TODO_LIMIT}`);
      return;
    }

    try {
      setIsEditing(true);
      setIsModalOpen(false);
      await dispatch(editTodo({ ...todo, title: editedTitle })).unwrap();
    } catch (error) {
      console.error("Error editing todo", error);
      showMessage("Error editing todo, please try again.");
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
      showMessage("Error deleting todo, please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = () => {
    if (todo._id) {
      dispatch(changeStatus(todo));
    }
  };

  const handleTextareaChange = (value: string) => {
    setEditedTitle(value);
    if (value.length > TODO_LIMIT) {
      setShowLimitHint(true);
      showMessage(`Exceeded limit by ${value.length - TODO_LIMIT} characters.`);
    } else {
      setShowLimitHint(false);
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
