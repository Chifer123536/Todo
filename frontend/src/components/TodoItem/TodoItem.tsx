import { motion } from "framer-motion";
import { ITodo } from "../../Redux/Slices/todoSlice";
import styles from "./TodoItem.module.scss";
import ModalCard from "../ModalCard/ModalCard";
import ModalContent from "../ModalCard/ModalContent";
import useItemActions from "../../hooks/useItemActions";
import useHotkey from "../../hooks/useHotkey";
import { getAnimatedText } from "../../utils/getAnimatedText";

interface ITodoItemProps {
  todo: ITodo;
  loading: boolean;
}

const TodoItem: React.FC<ITodoItemProps> = ({ todo }) => {
  const {
    handleEditSave,
    handleDelete,
    handleChange,
    handleTextareaChange,
    isModalOpen,
    setIsModalOpen,
    editedTitle,
    showLimitHint,
    isEditing,
    isDeleting,
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
          disabled={isEditing || isDeleting}
          onChange={handleChange}
        />

        <h3
          className={`${styles.todo_title} ${
            todo.completed ? styles.completed : ""
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          {isDeleting
            ? getAnimatedText("Deleting...")
            : isEditing
            ? getAnimatedText("Editing...")
            : todo.title}
        </h3>

        <button onClick={handleDelete} className={styles.delete_button}>
          Delete
        </button>
      </motion.div>

      <ModalCard isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent
          value={editedTitle}
          onChange={handleTextareaChange}
          onSave={handleEditSave}
          onCancel={handleDelete}
          limit={999}
          showLimitHint={showLimitHint}
          isLoading={isEditing || isDeleting}
          placeholder="Edit task..."
          cancelText="Delete"
          accepText="Save"
        />
      </ModalCard>
    </>
  );
};

export default TodoItem;
