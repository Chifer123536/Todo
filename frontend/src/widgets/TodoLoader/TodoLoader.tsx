import React, { useEffect, useState } from "react";
import styles from "./Loader.module.scss";
import { useTheme } from "next-themes";

interface LoaderProps {
  isLoading: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isLoading || !mounted) return null;

  const dotClass =
    resolvedTheme === "dark"
      ? `${styles.dot} ${styles.light}`
      : `${styles.dot} ${styles.dark}`;

  return (
    <div className={styles.loader_container}>
      <span className={dotClass}></span>
      <span className={dotClass}></span>
      <span className={dotClass}></span>
    </div>
  );
};
