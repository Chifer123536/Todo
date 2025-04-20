import { RootState } from "@/shared/todo/config/store";

export const selectTheme = (state: RootState): "light" | "dark" => {
  return state.theme.darkMode ? "dark" : "light";
};

export const selectDarkMode = (state: RootState): boolean => {
  return state.theme.darkMode;
};
