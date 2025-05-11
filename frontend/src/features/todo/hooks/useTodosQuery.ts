import { useQuery } from "@tanstack/react-query";
import { TodoService } from "../services/todo.service";

export function useTodosQuery() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: TodoService.getAll,
  });
}
