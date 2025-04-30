"use client";

import { memo, useState, useRef, useCallback } from "react";
import { ModalCard, ModalContent } from "@/widgets/ModalCard";
import { useTodosQuery } from "@/features/todo/hooks/useTodosQuery";
import { useHotkey } from "@/shared/todo/hooks/useHotkey";
import { useAddActions } from "@/features/todo/hooks/useAddActions";
import { useTodoListActions } from "@/features/todo/hooks/useTodoListActions";

import styles from "./AddTodo.module.scss";

export const AddTodo: React.FC = memo(() => {
  const { data: todos = [] } = useTodosQuery();
  const { handlePageChange, todosPerPage } = useTodoListActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxPages = 10;
  const maxTodos = todosPerPage * maxPages;

  useHotkey(setIsModalOpen);

  const { title, showLimitHint, handleInputChange, handleSubmit, isAdding } =
    useAddActions(
      maxTodos,
      todos.length,
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
          disabled={isAdding}
          placeholder="Enter new task..."
          onChange={(e) => handleInputChange(e.target.value)}
          className={styles.input}
        />
        <button
          type="button"
          className={styles.addTodoButton}
          onClick={handleOpenModal}
          disabled={isAdding}
        >
          {isAdding ? "Add..." : "Add"}
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
          isLoading={isAdding}
          placeholder="Enter new task..."
          cancelText="Cancel"
          accepText="Create"
        />
      </ModalCard>
    </div>
  );
});
