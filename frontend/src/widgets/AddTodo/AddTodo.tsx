"use client";

import { memo, useState, useRef, useCallback } from "react";
import { ModalCard, ModalContent } from "@/widgets/ModalCard";
import { useHotkey } from "@/shared/todo/hooks/useHotkey";
import { useAddActions } from "@/features/todo/hooks/useAddActions";

import styles from "./AddTodo.module.scss";

interface AddTodoProps {
  todosLength: number;
  todosPerPage: number;
  handlePageChange: (page: number) => void;
}

export const AddTodo: React.FC<AddTodoProps> = memo(
  ({ todosLength, todosPerPage, handlePageChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const maxPages = 10;
    const maxTodos = todosPerPage * maxPages;

    useHotkey(setIsModalOpen);

    const { title, showLimitHint, handleInputChange, handleSubmit } =
      useAddActions(
        maxTodos,
        todosLength,
        todosPerPage,
        setIsModalOpen,
        inputRef,
        handlePageChange,
      );

    const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

    const handleFormSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(e);
      },
      [handleSubmit],
    );

    return (
      <div className={styles.formContainer}>
        <form onSubmit={handleFormSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={title}
            placeholder="Enter new task..."
            onChange={(e) => handleInputChange(e.target.value)}
            className={styles.input}
          />
          <button
            type="button"
            className={styles.addTodoButton}
            onClick={handleOpenModal}
          >
            Add
          </button>
        </form>

        <ModalCard isOpen={isModalOpen} onClose={handleCloseModal}>
          <ModalContent
            value={title}
            onChange={handleInputChange}
            onSave={handleSubmit}
            onCancel={handleCloseModal}
            limit={999}
            showLimitHint={showLimitHint}
            isLoading={false}
            placeholder="Enter new task..."
            cancelText="Cancel"
            accepText="Create"
          />
        </ModalCard>
      </div>
    );
  },
);
