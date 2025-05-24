import React from "react";
import styles from "./Loader.module.scss";
import { useTheme } from "next-themes";

interface LoaderProps {
  isLoading: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  const { resolvedTheme } = useTheme();

  if (!isLoading) return null;

  const dotClass =
    resolvedTheme === "dark"
      ? `${styles.dot} ${styles.light}`
      : `${styles.dot} ${styles.dark}`;

  return (
    <div className={styles.loader_container}>
      <span className={dotClass} data-testid="loader-dot"></span>
      <span className={dotClass} data-testid="loader-dot"></span>
      <span className={dotClass} data-testid="loader-dot"></span>
    </div>
  );
};
