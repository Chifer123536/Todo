import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { FormEvent, useState, useEffect } from "react";
import { addTodo } from "../../Redux/Slices/todoSlice";
import ModalCard from "../ModalCard/ModalCard";
import styles from "./AddTodo.module.scss";

const AddTodo: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { todosLength } = useSelector((state: RootState) => state.todos);
  const [title, setTitle] = useState("");
  const [overflowMessage, setOverflowMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLimitHint, setShowLimitHint] = useState(false);
  const limit: number = 999;
  const todosPerPage = 5;
  const maxPages = 10;
  const maxTodos = todosPerPage * maxPages;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleInputChange = (value: string) => {
    setTitle(value);
    setShowLimitHint(value.length >= limit);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (title.length > limit) {
      setOverflowMessage(`Max length: ${limit}`);
      setTimeout(() => {
        setOverflowMessage("");
      }, 5000);
      return;
    }

    if (todosLength >= maxTodos) {
      setOverflowMessage("The task limit has been reached.");
      setTimeout(() => {
        setOverflowMessage("");
      }, 5000);
      return;
    }

    if (!title.trim()) {
      setOverflowMessage("Your task is empty.");
      setTimeout(() => {
        setOverflowMessage("");
      }, 5000);
      return;
    }

    dispatch(addTodo({ title, completed: false }));
    setIsModalOpen(false);
    setTitle("");
  };

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
            maxLength={limit}
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
