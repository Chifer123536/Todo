import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useState } from "react";
import ModalCard from "../ModalCard/ModalCard";
import styles from "./AddTodo.module.scss";
import useHotkey from "../../hooks/useHotkey";
import useAddActions from "../../hooks/useAddActions";

const AddTodo: React.FC = () => {
  const { todosLength } = useSelector((state: RootState) => state.todos);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit: number = 999;
  const todosPerPage = 5;
  const maxPages = 10;
  const maxTodos = todosPerPage * maxPages;

  useHotkey(setIsModalOpen);
  const {
    title,
    overflowMessage,
    showLimitHint,
    handleInputChange,
    handleSubmit,
  } = useAddActions(limit, maxTodos, todosLength, setIsModalOpen);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          placeholder="Enter new task..."
          onChange={(e) => handleInputChange(e.target.value)}
          className={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
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
        <div className={styles.textarea_container}>
          <textarea
            value={title}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter new task..."
            className={styles.textarea}
          />
          <div
            className={`${styles.limit_hint} ${
              showLimitHint ? styles.visible : ""
            }`}
          >
            Max length: {limit}
          </div>
        </div>
        <div className="modal_button_container">
          <button
            onClick={handleCloseModal}
            className={styles.modal_delete_button}
          >
            Cancel
          </button>
          <button onClick={handleSubmit} className={styles.modal_save_button}>
            Create
          </button>
        </div>
      </ModalCard>
    </div>
  );
};

export default AddTodo;
