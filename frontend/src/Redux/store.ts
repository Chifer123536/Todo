import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./Slices/todoSlice";
import themeSlice from "./Slices/themeSlice";

const store = configureStore({
  reducer: {
    todos: todoSlice,
    theme: themeSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
