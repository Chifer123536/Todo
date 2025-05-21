import { FormEvent, MutableRefObject, useRef } from "react";
import { useAddTodoMutation } from "./useAddTodoMutation";
import { useTodoInput } from "@/shared/todo/hooks/useTodoInput";
import { useTodoValidation } from "@/shared/todo/hooks/useTodoValidation";
import { toast } from "sonner";

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
  } = useTodoInput();

  const { validateTitle } = useTodoValidation();
  const { mutate } = useAddTodoMutation();

  const lastMaxLimitToastTimeRef = useRef(0);
  const maxLimitThrottleMs = 1000;

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    if (!validateTitle(title)) return;

    if (todosLength >= maxTodos) {
      const now = Date.now();
      if (now - lastMaxLimitToastTimeRef.current > maxLimitThrottleMs) {
        toast.error("Todo limit reached.", { id: "todo-max-limit" });
        lastMaxLimitToastTimeRef.current = now;
      }
      return;
    }

    setIsModalOpen(false);

    const updatedTodosLength = todosLength + 1;
    const lastPage = Math.ceil(updatedTodosLength / todosPerPage);
    handlePageChange(lastPage);

    if (typeof window !== "undefined") {
      localStorage.setItem("currentPage", String(lastPage));
    }

    mutate({ title, completed: false });

    setTitle("");
    handleChange("");

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return {
    title,
    showLimitHint,
    handleInputChange: handleChange,
    handleSubmit,
  };
};
