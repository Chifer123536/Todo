import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "../services/todo.service";
import { ITodo } from "@/shared/todo/model/types";
import { toast } from "sonner";

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TodoService.update,
    onMutate: async (updatedTodo: ITodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<ITodo[]>(["todos"]) ?? [];

      queryClient.setQueryData<ITodo[]>(["todos"], (old) =>
        old?.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo)),
      );

      return { previousTodos };
    },
    onError: (_error, _, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
      toast.error("Error updating todo, please try again.");
    },
  });
}
