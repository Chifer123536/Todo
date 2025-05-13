import { FormEvent, useState, MutableRefObject } from "react";
import { useAddTodoMutation } from "./useAddTodoMutation";
import { useTodoInput } from "@/shared/todo/hooks/useTodoInput";

export const useAddActions = (
  maxTodos: number,
  todosLength: number,
  todosPerPage: number,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  inputRef: MutableRefObject<HTMLInputElement | null>,
  handlePageChange: (page: number) => void,
) => {
  const {
    value: title,
    setValue: setTitle,
    showLimitHint,
    handleChange,
    validateTitle,
  } = useTodoInput();
  const [isAdding, setIsAdding] = useState(false);

  const { mutateAsync: addTodo } = useAddTodoMutation();

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (isAdding) return;
    if (!validateTitle(title)) return;

    if (todosLength >= maxTodos) {
      return;
    }

    try {
      setIsAdding(true);
      setIsModalOpen(false);

      await addTodo({ title, completed: false });

      // вычисляем последнюю страницу с учётом новой задачи
      const updatedTodosLength = todosLength + 1;
      const lastPage = Math.ceil(updatedTodosLength / todosPerPage);

      // переключаем страницу и записываем в localStorage
      handlePageChange(lastPage);
      if (typeof window !== "undefined") {
        localStorage.setItem("currentPage", String(lastPage));
      }
    } catch (error) {
      console.error("Error adding todo", error);
    } finally {
      setTitle("");
      setIsAdding(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return {
    title,
    showLimitHint,
    isAdding,
    handleInputChange: handleChange,
    handleSubmit,
  };
};
