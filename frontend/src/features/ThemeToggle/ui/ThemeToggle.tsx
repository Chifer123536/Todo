import { useDispatch, useSelector } from "react-redux";

import { toggleTheme } from "@/app/providers/ThemeProvider/model/slice";
import { AppDispatch, RootState } from "@/shared/config/store";
import { FaSun, FaMoon } from "react-icons/fa";

import styles from "./ThemeToggle.module.scss";

export const ThemeToggle: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button onClick={handleThemeToggle} className={styles.themeToggle}>
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};
