import { memo, useState, useRef, useCallback } from "react";

import { ModalCard, ModalContent } from "@/shared/ui/ModalCard";
import { useAppDispatch, useAppSelector, useHotkey } from "@/shared/lib/hooks";
import { getAnimatedText } from "@/shared/lib/getAnimatedText";
import { useAddActions } from "@/features/AddTodo";
import { setOverflowMessage } from "@/features/OverflowMessage/model/slice";

import styles from "./addTodo.module.scss";

export const AddTodo: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const todosLength = useAppSelector((state) => state.todos.todosLength);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const todosPerPage = 5;
  const maxPages = 10;
  const maxTodos = todosPerPage * maxPages;

  useHotkey(setIsModalOpen);

  const showMessage = useCallback(
    (message: string) => dispatch(setOverflowMessage(message)),
    [dispatch],
  );

  const { title, showLimitHint, handleInputChange, handleSubmit, isAdding } =
    useAddActions(maxTodos, todosLength, setIsModalOpen, showMessage, inputRef);

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
          {isAdding ? getAnimatedText("Add...") : "Add"}
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
