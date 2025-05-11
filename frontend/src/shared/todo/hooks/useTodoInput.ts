import { useState } from "react";
import { useTodoValidation, TODO_LIMIT } from "./useTodoValidation";

export const useTodoInput = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [showLimitHint, setShowLimitHint] = useState(
    initialValue.length > TODO_LIMIT,
  );

  const { validateTitle, showLimitToast } = useTodoValidation();

  const handleChange = (val: string) => {
    setValue(val);

    showLimitToast(val);

    setShowLimitHint(val.length > TODO_LIMIT);
  };

  return {
    value,
    setValue,
    showLimitHint,
    handleChange,
    validateTitle,
  };
};
