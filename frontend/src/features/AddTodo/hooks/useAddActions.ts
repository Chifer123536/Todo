import { FormEvent, useState, MutableRefObject } from "react";

import { addTodo } from "@/entities/todo/model/slice";
import { useAppDispatch } from "@/shared/lib/hooks";

export const useAddActions = (
  limit: number,
  maxTodos: number,
  todosLength: number,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  showMessage: (message: string) => void,
  inputRef: MutableRefObject<HTMLInputElement | null>,
) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [showLimitHint, setShowLimitHint] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleInputChange = (value: string) => {
    const excess = value.length - limit;
    if (excess > 0) {
      showMessage(`Limit exceeded -${excess}`);
    }
    setTitle(value);
    setShowLimitHint(value.length >= limit);
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (isAdding) return;

    if (title.length > limit) {
      showMessage(`Limit exceeded -${title.length - limit}`);
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
      setIsModalOpen(false);
      setIsAdding(true);
      await dispatch(addTodo({ title, completed: false })).unwrap();
    } catch (error) {
      console.error("Error adding todo", error);
      showMessage("Error adding todo, please try again.");
    } finally {
      // Автофокус на инпут
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      setTitle("");
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
