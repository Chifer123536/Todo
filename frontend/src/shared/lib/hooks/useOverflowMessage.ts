import { useCallback, useState } from "react";

export const useOverflowMessage = (timeout: 1000) => {
  const [overflowMessage, setOverflowMessage] = useState<string | null>(null);
  const [messageTimeout, setMessageTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const showMessage = useCallback(
    (message: string) => {
      if (messageTimeout) {
        clearTimeout(messageTimeout);
      }
      setOverflowMessage(message);
      const timeoutId = setTimeout(() => {
        setOverflowMessage(null);
      }, timeout);
      setMessageTimeout(timeoutId);
    },
    [messageTimeout, timeout],
  );

  const clearMessage = useCallback(() => {
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }
    setOverflowMessage(null);
  }, [messageTimeout]);

  return { overflowMessage, showMessage, clearMessage };
};
