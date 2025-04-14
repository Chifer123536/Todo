import { configureStore } from "@reduxjs/toolkit";
import { todoReducer } from "@/entities/todo";
import { themeReducer } from "@/app/providers/ThemeProvider";
export const store = configureStore({
  reducer: {
    todos: todoReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
