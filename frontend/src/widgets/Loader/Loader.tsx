import React from "react";

import styles from "./loader.module.scss";
import { useAppSelector } from "@/shared/lib/hooks";

export const Loader: React.FC = () => {
  const initialLoading = useAppSelector((state) => state.todos.initialLoading);
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  if (!initialLoading) return null;

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
