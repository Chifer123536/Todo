import { memo } from "react";
import { ITodo } from "@/entities/todo/model/slice";
import { useItemActions } from "../../features/todo/hooks/useItemActions";
import { ModalCard, ModalContent } from "@/shared/todo/ui/ModalCard";

import styles from "./todoItem.module.scss";

interface TodoItemProps {
  todo: ITodo;
}

export const TodoItem: React.FC<TodoItemProps> = memo(({ todo }) => {
  const {
    isModalOpen,
    setIsModalOpen,
    editedTitle,
    showLimitHint,
    isEditing,
    isDeleting,
    handleChange,
    handleDelete,
    handleEditSave,
    handleTextareaChange,
  } = useItemActions(todo);

  return (
    <div className={styles.todoItem}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleChange}
        disabled={isEditing || isDeleting}
      />
      <span
        className={`${styles.title} ${todo.completed ? styles.completed : ""}`}
        onClick={() => setIsModalOpen(true)}
      >
        {todo.title}
      </span>
      <button
        onClick={handleDelete}
        className={styles.deleteButton}
        disabled={isEditing || isDeleting}
      >
        Delete
      </button>

      <ModalCard isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent
          value={editedTitle}
          onChange={handleTextareaChange}
          onSave={handleEditSave}
          onCancel={() => setIsModalOpen(false)}
          limit={999}
          showLimitHint={showLimitHint}
          isLoading={isEditing}
          placeholder="Edit task..."
          cancelText="Cancel"
          accepText="Save"
        />
      </ModalCard>
    </div>
  );
});
