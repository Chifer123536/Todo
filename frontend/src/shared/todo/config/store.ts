import { configureStore } from "@reduxjs/toolkit";
import { todoReducer } from "@/entities/todo";
import { themeReducer } from "@/shared/providers/ThemeProvider";
import { overflowMessageReducer } from "@/features/todo/OverflowMessage";
export const store = configureStore({
  reducer: {
    todos: todoReducer,
    theme: themeReducer,
    overflowMessage: overflowMessageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
