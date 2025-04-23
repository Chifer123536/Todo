import { toast } from "sonner";

export const TODO_LIMIT = 999;

export const useTodoValidation = () => {
  const validateTitle = (title: string) => {
    if (!title.trim()) {
      toast.error("Task cannot be empty.");
      return false;
    }

    if (title.length > TODO_LIMIT) {
      toast.error(`Limit exceeded -${title.length - TODO_LIMIT}`);
      return false;
    }

    return true;
  };

  const showLimitToast = (value: string) => {
    const excess = value.length - TODO_LIMIT;
    if (excess > 0) {
      toast.error(`Limit exceeded -${excess}`);
    }
  };

  return { validateTitle, showLimitToast };
};
