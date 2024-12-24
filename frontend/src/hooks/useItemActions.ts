import {
  changeStatus,
  deleteTodo,
  editTodo,
  ITodo,
} from "../Redux/Slices/todoSlice";
import { AppDispatch } from "../Redux/store";
import { useDispatch } from "react-redux";
import { useState } from "react";

const useItemActions = (todo: ITodo) => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [showLimitHint, setShowLimitHint] = useState(false);
  const limit = 999;

  const handleEditSave = () => {
    if (todo._id) {
      if (editedTitle.trim() === "") {
        dispatch(deleteTodo(todo._id));
      } else {
        dispatch(editTodo({ ...todo, title: editedTitle }));
      }
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
    setShowLimitHint(value.length === limit);
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
  };
};

export default useItemActions;
