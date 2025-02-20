import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/store";
import { FormEvent, useState } from "react";
import { addTodo } from "../Redux/Slices/todoSlice";

const useAddActions = (
  limit: number,
  maxTodos: number,
  todosLength: number,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  showMessage: (message: string) => void
) => {
  const dispatch: AppDispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [showLimitHint, setShowLimitHint] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleInputChange = (value: string) => {
    const excess = value.length - limit;
    if (excess > 0) {
      showMessage(`Limit exceeded -${excess} `);
    }
    setTitle(value);
    setShowLimitHint(value.length >= limit);
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (isAdding) return;

    if (title.length > limit) {
      showMessage(`Limit exceeded -${title.length - limit} `);
      return;
    }

    if (!title.trim()) {
      showMessage("Task cannot be empty.");
      return;
    }

    if (todosLength >= maxTodos) {
      showMessage("The task limit has been reached.");
      return;
    }

    try {
      setIsAdding(true);
      await dispatch(addTodo({ title, completed: false })).unwrap();
      setIsModalOpen(false);
      setTitle("");
    } catch (error) {
      console.error("Error adding todo", error);
      showMessage("Error adding todo, please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return {
    title,
    showLimitHint,
    isAdding,
    handleInputChange,
    handleSubmit,
  };
};

export default useAddActions;
