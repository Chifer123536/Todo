import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "../services/todo.service";
import { toast } from "sonner";

export function useAddTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TodoService.add,
    onSuccess() {
      toast.success("Todo added successfully");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError(error) {
      toast.error("Error adding todo, please try again.");
      console.error(error);
    },
  });
}
