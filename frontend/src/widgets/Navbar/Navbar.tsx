import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/shared/config/store";

import { ThemeToggle } from "@/features/ThemeToggle";

import styles from "./Navbar.module.scss";

export const Navbar: React.FC = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

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

          <div className={styles.themeToggleContainer}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
