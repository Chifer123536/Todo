import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "../services/todo.service";
import { toast } from "sonner";

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TodoService.update,
    onSuccess() {
      toast.success("Todo updated successfully");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError(error) {
      toast.error("Error updating todo, please try again.");
      console.error(error);
    },
  });
}
