import styles from "./getAnimatedText.module.scss";

export const getAnimatedText = (text: string): React.ReactNode[] => {
  return text.split("").map((char, index) => (
    <span
      key={index}
      className={styles.animatedLetter}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {char}
    </span>
  ));
};
