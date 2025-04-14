import { createSlice } from "@reduxjs/toolkit";

interface IThemeState {
  darkMode: boolean;
}

const initialState: IThemeState = {
  darkMode:
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches),
};

const themeReducer = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("theme", state.darkMode ? "dark" : "light");
    },
  },
});

export const { toggleTheme } = themeReducer.actions;
export default themeReducer.reducer;
