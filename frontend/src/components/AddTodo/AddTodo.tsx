import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { FormEvent, useState } from "react";
import { addTodo } from "../../Redux/Slices/todoSlice";
import styles from "./AddTodo.module.scss";

const AddTodo: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { todosLength } = useSelector((state: RootState) => state.todos);
  const [title, setTitle] = useState("");
  const [overflowMessage, setOverflowMessage] = useState("");

  const todosPerPage = 5;
  const maxPages = 10;
  const maxTodos = todosPerPage * maxPages;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (todosLength >= maxTodos) {
      setOverflowMessage("The task limit has been reached.");
      setTimeout(() => {
        setOverflowMessage("");
      }, 5000);
      return;
    }

    if (title.trim()) {
      dispatch(addTodo({ title, completed: false }));
      setTitle("");
    }
  };

  return (
    <div className={styles.formContainer}>
      {overflowMessage && (
        <div className={styles.overflowMessage}>{overflowMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          placeholder="Add new todo..."
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.addTodoButton}>
          Add
        </button>
      </form>
    </div>
  );
};

export default AddTodo;
