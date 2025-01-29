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
  const { overflowMessage, showMessage } = useOverflowMessage(1000); // Подключаем хук
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [showLimitHint, setShowLimitHint] = useState(false);
  const limit = 999;

  const handleEditSave = () => {
    if (todo._id) {
      if (editedTitle.trim() === "") {
        showMessage("Task cannot be empty."); // Ошибка для пустого ввода
        return;
      }

      if (editedTitle.length > limit) {
        showMessage(
          `Exceeded limit by ${editedTitle.length - limit} characters.`
        );
        return;
      }

      dispatch(editTodo({ ...todo, title: editedTitle }));
      setIsModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (todo._id) {
      dispatch(deleteTodo(todo._id));
    }
  };

  const handleChange = () => {
    if (todo._id) {
      dispatch(changeStatus(todo));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditedTitle(value);

    if (value.length > limit) {
      setShowLimitHint(true);
      showMessage(`Exceeded limit by ${value.length - limit} characters.`);
    } else {
      setShowLimitHint(false);
    }
  };

  return {
    overflowMessage, // Возвращаем состояние ошибки
    handleEditSave,
    handleDelete,
    handleChange,
    handleTextareaChange,
    isModalOpen,
    setIsModalOpen,
    editedTitle,
    showLimitHint,
  };
};

export default useItemActions;
