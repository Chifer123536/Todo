import styles from "./errorMessage.module.scss";
import { useAppSelector } from "@/shared/lib/hooks";

export const ErrorMessage: React.FC = () => {
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorText}>Something went wrong</p>
      <img
        src={`${darkMode ? "/darkError.png" : "/lightError.png"}`}
        className={styles.errorIcon}
        alt="errorImage"
        onClick={() => window.location.reload()}
      />
    </div>
  );
};
