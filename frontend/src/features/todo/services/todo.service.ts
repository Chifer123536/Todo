import api from "@/shared/api";
import { ITodo } from "@/features/todo/types";

export class TodoService {
  static async getAll(): Promise<ITodo[]> {
    const { data } = await api.get<ITodo[]>("/todos");
    return data;
  }

  static async add(todo: Omit<ITodo, "id">): Promise<ITodo> {
    const { data } = await api.post<ITodo>("/todos", todo);
    return data;
  }

  static async remove(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  }

  static async update(todo: ITodo): Promise<ITodo> {
    const { data } = await api.put<ITodo>(`/todos/${todo._id}`, todo);
    return data;
  }
}
