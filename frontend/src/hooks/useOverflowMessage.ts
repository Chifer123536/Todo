import { useCallback, useState } from "react";

const useOverflowMessage = (timeout: 1000) => {
  const [overflowMessage, setOverflowMessage] = useState<string | null>(null);
  const [messageTimeout, setMessageTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

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
    [messageTimeout, timeout]
  );

  const clearMessage = useCallback(() => {
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }
    setOverflowMessage(null);
  }, [messageTimeout]);

  return { overflowMessage, showMessage, clearMessage };
};

export default useOverflowMessage;
