import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "@/shared/todo/api/axiosConfig";

export interface ITodo {
  _id?: string;
  title: string;
  completed: boolean;
}

interface IinitialState {
  todos: ITodo[];
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  todosLength: number;
}

const initialState: IinitialState = {
  todos: [],
  loading: false,
  initialLoading: true,
  error: null,
  todosLength: 0,
};

export const getTodos = createAsyncThunk("todos/getTodos", async () => {
  const response = await api.get("/todos");
  return response.data;
});

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (todo: ITodo) => {
    const response = await api.post("/todos", todo);
    return response.data;
  },
);

export const editTodo = createAsyncThunk(
  "todos/editTodo",
  async (todo: ITodo) => {
    const response = await api.put(`/todos/${todo._id}`, todo);
    return response.data;
  },
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (_id: string) => {
    await api.delete(`/todos/${_id}`);
    return _id;
  },
);

export const changeStatus = createAsyncThunk(
  "todos/changeStatus",
  async (todo: ITodo) => {
    const response = await api.put(`/todos/${todo._id}`, {
      ...todo,
      completed: !todo.completed,
    });
    return response.data;
  },
);

const todoReducer = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getTodos
    builder.addCase(getTodos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTodos.fulfilled, (state, action) => {
      state.loading = false;
      state.initialLoading = false;
      state.todos = action.payload;
      state.todosLength = action.payload.length;
    });
    builder.addCase(getTodos.rejected, (state, action) => {
      state.loading = false;
      state.initialLoading = false;
      state.error = action.error.message || "Failed to get todos";
    });

    // addTodo
    builder.addCase(addTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.todos.push(action.payload);
      state.todosLength += 1;
    });
    builder.addCase(addTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add todo";
    });

    // editTodo
    builder.addCase(editTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = state.todos.map((todo) =>
        todo._id === action.payload._id ? action.payload : todo,
      );
    });

    builder.addCase(editTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to edit todo";
    });

    // deleteTodo
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      state.todosLength = Math.max(0, state.todosLength - 1);
    });
    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.error = action.error.message || "Failed to delete todo";
    });

    // changeStatus
    builder.addCase(changeStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(changeStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = state.todos.map((todo) =>
        todo._id === action.payload._id ? action.payload : todo,
      );
    });

    builder.addCase(changeStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to change status";
    });
  },
});

export default todoReducer.reducer;
