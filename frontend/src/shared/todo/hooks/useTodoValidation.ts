import { toast } from "sonner";

export const TODO_LIMIT = 999;
const LIMIT_TOAST_ID = "todo-limit";

export const useTodoValidation = () => {
  const validateTitle = (title: string): boolean => {
    if (!title.trim()) {
      toast.error("Task cannot be empty.", { id: LIMIT_TOAST_ID });
      return false;
    }
    if (title.length > TODO_LIMIT) {
      const excess = title.length - TODO_LIMIT;
      toast.error(`Limit exceeded by ${excess} chars.`, { id: LIMIT_TOAST_ID });
      return false;
    }
    return true;
  };

  const showLimitToast = (value: string) => {
    const excess = value.length - TODO_LIMIT;
    if (excess > 0) {
      toast(`Limit exceeded by ${excess} chars.`, { id: LIMIT_TOAST_ID });
    } else {
      toast.dismiss(LIMIT_TOAST_ID);
    }
  };

  return { validateTitle, showLimitToast };
};
