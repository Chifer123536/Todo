import React from "react";
import { ThemeToggle } from "@/features/ThemeToggle";
import { useAppSelector } from "@/shared/lib/hooks";
import { getOverflowMessage } from "@/features/OverflowMessage/model/selectors";
import { OverflowMessage } from "@/features/OverflowMessage/ui/OverflowMessage/OverflowMessage";

import styles from "./navbar.module.scss";

export const Navbar: React.FC = () => {
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const overflowMessage = useAppSelector(getOverflowMessage);

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles["dark-mode"] : ""}`}>
      <div className={styles.container}>
        <div className={styles.navbarContent}>
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <div className={`${styles.hoverArea} ${styles.left}`}></div>
              <div className={`${styles.hoverArea} ${styles.right}`}></div>
              <img
                src={darkMode ? "/lightLogo.png" : "/darkLogo.png"}
                className={styles.logo}
                alt="logo"
              />
            </div>
            <h1 className={styles.title}>Todo List</h1>
          </div>
          {overflowMessage && (
            <div className={styles.messageWrapper}>
              <OverflowMessage />
            </div>
          )}
          <div className={styles.themeToggleContainer}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
