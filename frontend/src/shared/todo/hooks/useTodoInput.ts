import { useState } from "react"
import { TODO_LIMIT } from "./useTodoValidation"

export const useTodoInput = (initialValue = "") => {
  const [value, setValue] = useState(initialValue)
  const [showLimitHint, setShowLimitHint] = useState(
    initialValue.length > TODO_LIMIT
  )

  const handleChange = (val: string) => {
    setValue(val)
    setShowLimitHint(val.length > TODO_LIMIT)
  }

  return {
    value,
    setValue,
    showLimitHint,
    handleChange
  }
}
