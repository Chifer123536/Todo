import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../Redux/Slices/themeSlice";
import { AppDispatch, RootState } from "../../Redux/store";
import { FaSun, FaMoon } from "react-icons/fa";
import styles from "./ThemeToggle.module.scss";

const ThemeToggle: React.FC = () => {
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

export default ThemeToggle;
