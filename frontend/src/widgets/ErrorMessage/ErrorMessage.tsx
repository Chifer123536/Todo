import { useTheme } from "next-themes"
import styles from "./ErrorMessage.module.scss"

export const ErrorMessage: React.FC = () => {
  const { resolvedTheme } = useTheme()

  const errorImage =
    resolvedTheme === "dark" ? "/darkError.png" : "/lightError.png"

  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorText}>Something went wrong</p>
      <img
        src={errorImage}
        className={styles.errorIcon}
        alt="errorImage"
        onClick={() => window.location.reload()}
      />
    </div>
  )
}
