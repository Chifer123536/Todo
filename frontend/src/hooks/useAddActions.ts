import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/store";
import { FormEvent, useState, useCallback } from "react";
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
  const [loading, setLoading] = useState(false);

  const [messageTimeout, setMessageTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const clearMessageTimeout = useCallback(() => {
    if (messageTimeout) {
      clearTimeout(messageTimeout);
      setMessageTimeout(null);
    }
  }, [messageTimeout]);

  const handleInputChange = (value: string) => {
    const excess = value.length - limit;
    if (excess > 0) {
      setOverflowMessage(`-${excess}`);
    } else {
      setOverflowMessage("");
    }
    setTitle(value);
    setShowLimitHint(value.length >= limit);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (title.length > limit) {
      setOverflowMessage(`-${title.length - limit} `);
      return;
    }

    if (!title.trim()) {
      setOverflowMessage("Your task is empty.");
      clearMessageTimeout();
      setMessageTimeout(
        setTimeout(() => {
          setOverflowMessage("");
        }, 1000)
      );
      return;
    }

    if (todosLength >= maxTodos) {
      setOverflowMessage("The task limit has been reached.");
      clearMessageTimeout();
      setMessageTimeout(
        setTimeout(() => {
          setOverflowMessage("");
        }, 1000)
      );
      return;
    }

    try {
      setLoading(true);
      await dispatch(addTodo({ title, completed: false })).unwrap();
      setIsModalOpen(false);
      setTitle("");
    } catch (error) {
      console.error("Error adding todo", error);
      setOverflowMessage("Error adding todo, try again");
      clearMessageTimeout();
      setMessageTimeout(
        setTimeout(() => {
          setOverflowMessage("");
        }, 1000)
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    overflowMessage,
    showLimitHint,
    loading,
    handleInputChange,
    handleSubmit,
  };
};

export default useAddActions;
