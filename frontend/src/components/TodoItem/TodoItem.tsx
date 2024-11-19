import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import styles from "./TodoItem.module.scss";
import {
  changeStatus,
  deleteTodo,
  editTodo,
  ITodo,
} from "../../Redux/Slices/todoSlice";
import { AppDispatch } from "../../Redux/store";
import { useState } from "react";

interface ITodoItemProps {
  todo: ITodo;
  loading: boolean;
}

const TodoItem: React.FC<ITodoItemProps> = ({ todo, loading }) => {
  const dispatch: AppDispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEdit = () => {
    setIsEdit((prev) => !prev);
  };

  const handleEditSave = () => {
    if (todo._id) {
      dispatch(editTodo({ ...todo, title: editedTitle }));
      setIsEdit(false);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSave();
    }
  };

  return (
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
        onChange={() => handleChange()}
      />
      {isEdit ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
      ) : (
        <h3 className={styles.todo_title} onClick={handleEdit}>
          {todo.title}
        </h3>
      )}
      <button onClick={handleDelete} disabled={loading}>
        Delete
      </button>
    </motion.div>
  );
};

export default TodoItem;
