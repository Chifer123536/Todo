import React from "react";
import styles from "./loader.module.scss";
import { useAppSelector } from "@/shared/lib/hooks";

export const Loader: React.FC = () => {
  const initialLoading = useAppSelector((state) => state.todos.initialLoading);

  if (!initialLoading) return null;

  return (
    <div className={styles.loader_container}>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
    </div>
  );
};
