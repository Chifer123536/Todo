import React from "react";
import styles from "./../TodoItem/TodoItem.module.scss";
import useOverflowMessage from "../../hooks/useOverflowMessage";
import useAddActions from "../../hooks/useAddActions";

interface ModalContentProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  limit: number;
  showLimitHint: boolean;
  isLoading: boolean;
  placeholder?: string;
  cancelText: string;
  accepText: string;
}

const ModalContent: React.FC<ModalContentProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  limit,
  showLimitHint,
  isLoading,
  placeholder = "Enter text...",
  cancelText,
  accepText,
}) => {
  const { overflowMessage } = useOverflowMessage(1000);

  return (
    <>
      <div className={styles.textarea_container}>
        {overflowMessage && (
          <div
            className={`${styles.overflowMessage} ${
              isModalOpen ? styles.modalVisible : ""
            }`}
          >
            {overflowMessage}
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className={styles.textarea}
        />
        <div className={`limit_hint ${showLimitHint ? "visible" : ""}`}>
          Max length: {limit}
        </div>
      </div>
      <div className={styles.modal_button_container}>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className={styles.modal_delete_button}
        >
          {cancelText}
        </button>
        <button
          onClick={onSave}
          disabled={isLoading}
          className={styles.modal_save_button}
        >
          {accepText}
        </button>
      </div>
    </>
  );
};

export default ModalContent;
