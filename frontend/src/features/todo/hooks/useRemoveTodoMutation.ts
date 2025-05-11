import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "../services/todo.service";
import { ITodo } from "@/shared/todo/model/types";
import { toast } from "sonner";

export function useRemoveTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TodoService.remove,
    onMutate: async (todoId: string) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<ITodo[]>(["todos"]) ?? [];

      queryClient.setQueryData<ITodo[]>(["todos"], (old) =>
        old?.filter((todo) => todo._id !== todoId),
      );

      return { previousTodos };
    },
    onError: (_error, _, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
      toast.error("Error deleting todo, please try again.");
    },
  });
}
