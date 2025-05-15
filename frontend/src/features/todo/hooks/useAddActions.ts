import { FormEvent, MutableRefObject } from "react";
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

  const { mutate } = useAddTodoMutation();

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!validateTitle(title)) return;
    if (todosLength >= maxTodos) return;

    setIsModalOpen(false);

    const updatedTodosLength = todosLength + 1;
    const lastPage = Math.ceil(updatedTodosLength / todosPerPage);
    handlePageChange(lastPage);
    if (typeof window !== "undefined") {
      localStorage.setItem("currentPage", String(lastPage));
    }

    mutate({ title, completed: false });

    setTitle("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return {
    title,
    showLimitHint,
    handleInputChange: handleChange,
    handleSubmit,
  };
};
