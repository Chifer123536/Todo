import React from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import styles from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles["dark-mode"] : ""}`}>
      <div className={styles.container}>
        <div className={styles.navbarContent}>
          <div className={styles.logoContainer}>
            <img
              src={darkMode ? "/lightLogo.png" : "/darkLogo.png"}
              className={styles.logo}
              alt="logo"
            />
            <h1
              className={`${styles.title} ${
                darkMode ? styles["dark-mode"] : ""
              }`}
            >
              Todo List
            </h1>
          </div>
          <div className={styles.themeToggleContainer}>
            <ThemeToggle />
          </div>
          {/* <div className={styles.authContainer}>
              <Login />
              <Register >
            </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
