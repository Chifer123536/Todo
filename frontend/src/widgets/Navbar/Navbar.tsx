"use client";

import styles from "./Navbar.module.scss";

export const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navbarContent}>
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoWrapper}>
                <div className={styles.hoverArea + " " + styles.left} />
                <div className={styles.hoverArea + " " + styles.right} />
                <div className={styles.logoImageWrapper}>
                  <img
                    src="/darkLogo.png"
                    className={`${styles.logo} dark:hidden`}
                    alt="logo light"
                  />
                  <img
                    src="/lightLogo.png"
                    className={`${styles.logo} hidden dark:block`}
                    alt="logo dark"
                  />
                </div>
              </div>
            </div>
            <h1 className={styles.title}>Todo List</h1>
          </div>
        </div>
      </div>
    </nav>
  );
};
