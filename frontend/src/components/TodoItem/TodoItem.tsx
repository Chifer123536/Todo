import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      {isEdit ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
      ) : (
        <h3>{todo.title}</h3>
      )}
      <p>{todo.completed ? "Completed" : "Not Completed"}</p>
      {isEdit ? (
        <button onClick={handleEditSave} disabled={loading}>
          Save
        </button>
      ) : (
        <button onClick={handleEdit} disabled={loading}>
          Edit
        </button>
      )}
      <button onClick={handleChange} disabled={loading}>
        Change Status
      </button>
      <button onClick={handleDelete} disabled={loading}>
        Delete
      </button>
    </motion.div>
  );
};

export default TodoItem;
