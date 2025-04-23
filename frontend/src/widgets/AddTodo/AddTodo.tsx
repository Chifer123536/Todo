import { memo, useState, useRef, useCallback } from "react";
import { ModalCard, ModalContent } from "@/shared/todo/ui/ModalCard";
import { useAppSelector } from "@/shared/lib/hooks";
import { useHotkey } from "@/shared/todo/hooks/useHotkey";
import { useAddActions } from "@/features/todo/hooks/useAddActions";

import styles from "./addTodo.module.scss";

export const AddTodo: React.FC = memo(() => {
  const todosLength = useAppSelector((state) => state.todos.todosLength);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const todosPerPage = 5;
  const maxPages = 10;
  const maxTodos = todosPerPage * maxPages;

  useHotkey(setIsModalOpen);

  const { title, showLimitHint, handleInputChange, handleSubmit, isAdding } =
    useAddActions(maxTodos, todosLength, setIsModalOpen, inputRef);

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
