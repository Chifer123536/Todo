import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/store";
import { FormEvent, useState } from "react";
import { addTodo } from "../Redux/Slices/todoSlice";

const useAddActions = (
  limit: number,
  maxTodos: number,
  todosLength: number,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const dispatch: AppDispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [overflowMessage, setOverflowMessage] = useState("");
  const [showLimitHint, setShowLimitHint] = useState(false);
  const [loading, setLoading] = useState(false); // Состояние загрузки

  const handleInputChange = (value: string) => {
    setTitle(value);
    setShowLimitHint(value.length >= limit);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) return; // Блокируем добавление задач во время загрузки

    if (title.length > limit) {
      setOverflowMessage(`Max length: ${limit}`);
      setTimeout(() => {
        setOverflowMessage("");
      }, 5000);
      return;
    }

    if (todosLength >= maxTodos) {
      setOverflowMessage("The task limit has been reached.");
      setTimeout(() => {
        setOverflowMessage("");
      }, 5000);
      return;
    }

    if (!title.trim()) {
      setOverflowMessage("Your task is empty.");
      setTimeout(() => {
        setOverflowMessage("");
      }, 5000);
      return;
    }

    try {
      setLoading(true); // Включаем индикатор загрузки
      await dispatch(addTodo({ title, completed: false })).unwrap();
      setIsModalOpen(false);
      setTitle("");
    } catch (error) {
      console.error("Error while adding a task:", error);
      setOverflowMessage("Failed to add the task. Try again.");
      setTimeout(() => {
        setOverflowMessage("");
      }, 5000);
    } finally {
      setLoading(false); // Выключаем индикатор загрузки
    }
  };

  return {
    title,
    overflowMessage,
    showLimitHint,
    loading, // Экспортируем состояние загрузки для управления кнопками
    handleInputChange,
    handleSubmit,
  };
};

export default useAddActions;
