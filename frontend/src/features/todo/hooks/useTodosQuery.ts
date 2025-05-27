import { useQuery } from "@tanstack/react-query"
import { TodoService } from "../services/todo.service"
import { ITodo } from "@/shared/todo/types"

export function useTodosQuery() {
  return useQuery<ITodo[], Error>({
    queryKey: ["todos"],
    queryFn: TodoService.getAll
  })
}
