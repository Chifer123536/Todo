"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ITodo } from "@/features/todo/types";
import { useItemActions } from "@/features/todo/hooks/useItemActions";
import { useHotkey } from "@/shared/todo/hooks";
import { getAnimatedText } from "@/shared/lib/getAnimatedText";
import { ModalCard, ModalContent } from "@/widgets/ModalCard";
import { FaTrash } from "react-icons/fa";

import styles from "./TodoItem.module.scss";

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

  useHotkey(setIsModalOpen);

  return (
    <>
      <motion.div
        className={styles.todoItem}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleChange}
          disabled={isEditing || isDeleting}
          className={styles.custom_checkbox}
        />
        <h3
          className={`${styles.title} ${todo.completed ? styles.completed : ""}`}
          onClick={() => setIsModalOpen(true)}
        >
          {isEditing ? getAnimatedText("Editing...") : todo.title}
        </h3>
        <button
          onClick={handleDelete}
          className={styles.deleteButton}
          disabled={isEditing || isDeleting}
        >
          <FaTrash size={14} />
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
          isLoading={isEditing}
          placeholder="Edit task..."
          cancelText="Delete"
          accepText="Save"
        />
      </ModalCard>
    </>
  );
});
