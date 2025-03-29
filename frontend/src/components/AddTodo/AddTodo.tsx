import { memo, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import ModalCard from "../ModalCard/ModalCard";
import styles from "./AddTodo.module.scss";
import useHotkey from "../../hooks/useHotkey";
import useAddActions from "../../hooks/useAddActions";
import useOverflowMessage from "../../hooks/useOverflowMessage";
import ModalContent from "../ModalCard/ModalContent";
import { getAnimatedText } from "../../utils/getAnimatedText";

const AddTodo: React.FC = memo(() => {
  const todosLength = useSelector(
    (state: RootState) => state.todos.todosLength,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const limit: number = 999;
  const todosPerPage = 5;
  const maxPages = 10;
  const maxTodos = todosPerPage * maxPages;

  useHotkey(setIsModalOpen);
  const { overflowMessage, showMessage } = useOverflowMessage(1000);
  const { title, showLimitHint, handleInputChange, handleSubmit, isAdding } =
    useAddActions(
      limit,
      maxTodos,
      todosLength,
      setIsModalOpen,
      showMessage,
      inputRef,
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
      {overflowMessage && (
        <div
          className={`${styles.overflowMessage} ${
            isModalOpen ? styles.modalVisible : ""
          }`}
        >
          {overflowMessage}
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={title}
          disabled={isAdding}
          placeholder="Enter new task..."
          onChange={(e) => handleInputChange(e.target.value)}
          className={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleFormSubmit(e)}
        />
        <button
          type="button"
          className={styles.addTodoButton}
          disabled={isAdding}
          onClick={handleOpenModal}
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
          limit={limit}
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

export default AddTodo;
