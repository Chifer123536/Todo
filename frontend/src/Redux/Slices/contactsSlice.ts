import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface IinitialState {
  todos: ITodo[];
  loading: boolean;
  error: string | null;
}

const initialState: IinitialState = {
  todos: [],
  loading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await api.get("/todos");
  return response.data;
});

// Асинхронный экшен для добавления новой задачи
export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (todo: { title: string; completed: boolean }) => {
    const response = await api.post("/todos", todo);
    return response.data;
  }
);

// Асинхронный экшен для удаления задачи по id
export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: string) => {
    await api.delete(`/todos/${id}`);
    return id;
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // Тут могли бы быть синхронные экшены, но они нам не нужны
  },
  extraReducers: (builder) => {
    // Обработка экшена fetchTodos
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch todos";
      });

    // Обработка экшена addTodo
    builder
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add todo";
      });

    // Обработка экшена deleteTodo
    builder
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete todo";
      });
  },
});

// Экспортируем редюсер для использования в store
export default todosSlice.reducer;
