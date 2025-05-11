import React from "react";
import styles from "./Navbar.module.scss";

export const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navbarContent}>
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <div className={`${styles.hoverArea} ${styles.left}`} />
              <div className={`${styles.hoverArea} ${styles.right}`} />
              <img src="/darkLogo.png" className={styles.logo} alt="logo" />
            </div>
            <h1 className={styles.title}>Todo List</h1>
          </div>
        </div>
      </div>
    </nav>
  );
};
