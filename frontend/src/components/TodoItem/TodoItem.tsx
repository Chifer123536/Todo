import { motion } from "framer-motion";
import { ITodo } from "../../Redux/Slices/todoSlice";
import styles from "./TodoItem.module.scss";
import ModalCard from "../ModalCard/ModalCard";
import useItemActions from "../../hooks/useItemActions";
import useHotkey from "../../hooks/useHotkey";

interface ITodoItemProps {
  todo: ITodo;
  loading: boolean;
}

const TodoItem: React.FC<ITodoItemProps> = ({ todo, loading }) => {
  const {
    handleEditSave,
    handleDelete,
    handleChange,
    handleTextareaChange,
    isModalOpen,
    setIsModalOpen,
    editedTitle,
    showLimitHint,
  } = useItemActions(todo);
  useHotkey(setIsModalOpen);

  return (
    <>
      <motion.div
        className={styles.todo_item}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <input
          type="checkbox"
          className={styles.custom_checkbox}
          checked={todo.completed}
          disabled={loading}
          onChange={handleChange}
        />
        <h3
          className={`${styles.todo_title} ${
            todo.completed ? styles.completed : ""
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          {todo.title}
        </h3>
        <button
          onClick={handleDelete}
          disabled={loading}
          className={styles.delete_button}
        >
          Delete
        </button>
      </motion.div>

      {/* Модальное окно */}
      <ModalCard isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.textarea_container}>
          <textarea
            placeholder={todo.title}
            value={editedTitle}
            onChange={handleTextareaChange}
            disabled={loading}
            maxLength={999}
            className={styles.textarea}
          />
          <div
            className={`${styles.limit_hint} ${
              showLimitHint ? styles.visible : ""
            }`}
          >
            Max length: 999
          </div>
        </div>
        <div className={styles.modal_button_container}>
          <button
            onClick={handleDelete}
            disabled={loading}
            className={styles.modal_delete_button}
          >
            Delete
          </button>
          <button
            onClick={handleEditSave}
            disabled={loading}
            className={styles.modal_save_button}
          >
            Save
          </button>
        </div>
      </ModalCard>
    </>
  );
};

export default TodoItem;
