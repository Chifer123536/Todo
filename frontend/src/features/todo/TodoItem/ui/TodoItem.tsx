import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/shared/lib/hooks";

import { ITodo } from "@/entities/todo/model/slice";
import { ModalCard } from "@/shared/todo/ui/ModalCard";
import { ModalContent } from "@/shared/todo/ui/ModalCard/ModalContent";
import { useItemActions } from "@/features/todo/TodoItem/hooks/useItemActions";
import { useHotkey } from "@/shared/todo/hooks/useHotkey";
import { getAnimatedText } from "@/shared/lib/getAnimatedText/getAnimatedText";
import { setOverflowMessage } from "@/features/todo/OverflowMessage/model/slice";

import styles from "./todoItem.module.scss";

interface ITodoItemProps {
  todo: ITodo;
}

export const TodoItem: React.FC<ITodoItemProps> = memo(({ todo }) => {
  const dispatch = useAppDispatch();

  const showMessage = useCallback(
    (message: string) => dispatch(setOverflowMessage(message)),
    [dispatch],
  );

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
  } = useItemActions(todo, showMessage);

  useHotkey(setIsModalOpen);

  const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);
  const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

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
          onClick={openModal}
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

      <ModalCard isOpen={isModalOpen} onClose={closeModal}>
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
});
