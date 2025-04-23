import { FormEvent, useState, MutableRefObject } from "react";
import { toast } from "sonner";
import { useAddTodoMutation } from "./useAddTodoMutation";
import { useTodoInput } from "@/shared/todo/hooks/useTodoInput";

export const useAddActions = (
  maxTodos: number,
  todosLength: number,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  inputRef: MutableRefObject<HTMLInputElement | null>,
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
      toast.error("The task limit has been reached.");
      return;
    }

    try {
      setIsModalOpen(false);
      setIsAdding(true);
      await addTodo({ title, completed: false });
      toast.success("Task added successfully.");
    } catch (error) {
      console.error("Error adding todo", error);
      toast.error("Error adding todo, please try again.");
    } finally {
      setTimeout(() => inputRef.current?.focus(), 0);
      setTitle("");
      setIsAdding(false);
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
