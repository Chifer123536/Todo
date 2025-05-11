import { useEffect } from "react";

export const useHotkey = (
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsModalOpen]);
};
