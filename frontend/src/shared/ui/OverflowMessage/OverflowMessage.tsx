import cls from "./OverflowMessage.module.scss";

interface OverflowMessageProps {
  message: string;
  isModalOpen?: boolean;
}

export const OverflowMessage: React.FC<OverflowMessageProps> = ({
  message,
  isModalOpen,
}) => {
  return (
    <div
      className={`${cls.overflowMessage} ${isModalOpen ? cls.modalVisible : ""}`}
    >
      {message}
    </div>
  );
};
