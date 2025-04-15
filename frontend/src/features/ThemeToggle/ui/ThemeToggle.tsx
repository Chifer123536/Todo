import { toggleTheme } from "@/app/providers/ThemeProvider/model/slice";
import { FaSun, FaMoon } from "react-icons/fa";

import styles from "./ThemeToggle.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleThemeToggle}
      className={`${styles.themeToggle} ${className || ""}`}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};
