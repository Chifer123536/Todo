import React from "react";

import styles from "./Pagination.module.scss";

interface IPaginationProps {
  currentPage: number;
  todosLength: number;
  setCurrentPage: (page: number) => void;
}

export const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  todosLength,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(todosLength / 5);

  return (
    <div className={styles.pagination}>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`${styles.pageButton} ${
            currentPage === i + 1 ? styles.active : ""
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};
