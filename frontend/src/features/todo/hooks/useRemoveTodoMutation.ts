import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "../services/todo.service";
import { toast } from "sonner";

export function useRemoveTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TodoService.remove,
    onSuccess() {
      toast.success("Todo deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError(error) {
      toast.error("Error deleting todo, please try again.");
      console.error(error);
    },
  });
}
