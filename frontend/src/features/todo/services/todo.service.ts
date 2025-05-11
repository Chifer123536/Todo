import { api } from "@/shared/api";
import { ITodo } from "@/features/todo/types";

export class TodoService {
  static async getAll(): Promise<ITodo[]> {
    const todos = await api.get<ITodo[]>("/todos");
    return todos;
  }

  static async add(todo: Omit<ITodo, "id">): Promise<ITodo> {
    const newTodo = await api.post<ITodo>("/todos", todo);
    return newTodo;
  }

  static async remove(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  }

  static async update(todo: ITodo): Promise<ITodo> {
    const updated = await api.put<ITodo>(`/todos/${todo._id}`, todo);
    return updated;
  }
}
