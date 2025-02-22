import {
  changeStatus,
  deleteTodo,
  editTodo,
  ITodo,
} from "../Redux/Slices/todoSlice";
import { AppDispatch } from "../Redux/store";
import { useDispatch } from "react-redux";
import { useState } from "react";
import useOverflowMessage from "./useOverflowMessage";

const useItemActions = (todo: ITodo) => {
  const dispatch: AppDispatch = useDispatch();
  const { overflowMessage, showMessage } = useOverflowMessage(1000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [showLimitHint, setShowLimitHint] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeliting] = useState(false);
  const limit = 999;

  const handleEditSave = async () => {
    if (todo._id) {
      if (editedTitle.trim() === "") {
        showMessage("Task cannot be empty.");
        return;
      }

      if (editedTitle.length > limit) {
        showMessage(`Exceeded limit by ${editedTitle.length - limit}`);
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
    }
  };

  const handleDelete = async () => {
    if (todo._id) {
      try {
        setIsDeliting(true);
        await dispatch(deleteTodo(todo._id)).unwrap();
      } catch (error) {
        console.error("Error deleting todo", error);
        showMessage("Error deleting todo, please try again.");
      } finally {
        setIsDeliting(false);
      }
    }
  };

  const handleChange = () => {
    if (todo._id) {
      dispatch(changeStatus(todo));
    }
  };

  const handleTextareaChange = (value: string) => {
    setEditedTitle(value);
    if (value.length > limit) {
      setShowLimitHint(true);
      showMessage(`Exceeded limit by ${value.length - limit} characters.`);
    } else {
      setShowLimitHint(false);
    }
  };

  return {
    overflowMessage,
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

export default useItemActions;
