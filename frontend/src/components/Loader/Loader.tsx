import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import styles from "./Loader.module.scss";

const Loader: React.FC = () => {
  const loading = useSelector((state: RootState) => state.todos.loading);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  if (!loading) return null;

  return (
    <div className={styles.loader_container}>
      <span
        className={`${styles.dot} ${darkMode ? styles.dark : styles.light}`}
      ></span>
      <span
        className={`${styles.dot} ${darkMode ? styles.dark : styles.light}`}
      ></span>
      <span
        className={`${styles.dot} ${darkMode ? styles.dark : styles.light}`}
      ></span>
    </div>
  );
};

export default Loader;
