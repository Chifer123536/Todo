import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TodoService } from "../services/todo.service"
import { ITodo } from "@/shared/todo/types"

type CreateTodoInput = Omit<ITodo, "_id" | "clientId">

export function useAddTodoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (todo: CreateTodoInput) => TodoService.add(todo),

    onMutate: async (newTodo: CreateTodoInput) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] })

      const previousTodos = queryClient.getQueryData<ITodo[]>(["todos"]) || []

      const tempId = `temp-${Date.now()}`
      const optimisticTodo: ITodo = {
        _id: tempId,
        clientId: tempId,
        ...newTodo
      }

      queryClient.setQueryData<ITodo[]>(
        ["todos"],
        [...previousTodos, optimisticTodo]
      )

      return { previousTodos, tempId }
    },

    onError: (_err, _newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<ITodo[]>(["todos"], context.previousTodos)
      }
    },

    onSuccess: (data: ITodo, _vars, context) => {
      queryClient.setQueryData<ITodo[]>(["todos"], (old) => {
        if (!old || !context?.tempId) return old

        return old.map((todo) =>
          todo._id === context.tempId ? { ...todo, _id: data._id } : todo
        )
      })
    }
  })
}
