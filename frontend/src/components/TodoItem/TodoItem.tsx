import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import styles from "./TodoItem.module.scss";
import ModalCard from "../ModalCard/ModalCard";
import {
  changeStatus,
  deleteTodo,
  editTodo,
  ITodo,
} from "../../Redux/Slices/todoSlice";
import { AppDispatch } from "../../Redux/store";

interface ITodoItemProps {
  todo: ITodo;
  loading: boolean;
}

const TodoItem: React.FC<ITodoItemProps> = ({ todo, loading }) => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [showLimitHint, setShowLimitHint] = useState(false);
  const limit: number = 999;

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

  const handleEditSave = () => {
    if (todo._id) {
      if (editedTitle.trim() === "") {
        dispatch(deleteTodo(todo._id));
      } else {
        dispatch(editTodo({ ...todo, title: editedTitle }));
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (todo._id) {
      dispatch(deleteTodo(todo._id));
    }
  };

  const handleChange = () => {
    if (todo._id) {
      dispatch(changeStatus(todo));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditedTitle(value);
    setShowLimitHint(value.length === limit);
  };

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
            maxLength={limit}
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
