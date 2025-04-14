import { useSelector } from "react-redux";
import { RootState } from "@/shared/config/store";

import styles from "./ErrorMessage.module.scss";

export const ErrorMessage: React.FC = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

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
