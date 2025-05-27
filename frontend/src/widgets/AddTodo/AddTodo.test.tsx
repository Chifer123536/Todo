import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

jest.mock("@/shared/todo/hooks/useHotkey", () => ({
  useHotkey: jest.fn()
}))

jest.mock("@/features/todo/hooks/useAddActions", () => ({
  useAddActions: jest.fn()
}))

jest.mock("@/widgets/ModalCard", () => ({
  ModalCard: ({ isOpen, onClose, children }: any) =>
    isOpen ? (
      <div>
        <button data-testid="close-modal-button" onClick={onClose}>
          Close Modal
        </button>
        {children}
      </div>
    ) : null,

  ModalContent: ({
    value,
    onChange,
    onSave,
    onCancel,
    showLimitHint,
    placeholder,
    cancelText,
    accepText
  }: any) => (
    <div>
      <input
        data-testid="modal-input"
        aria-label="modal-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button data-testid="modal-save-button" onClick={onSave}>
        {accepText}
      </button>
      <button data-testid="modal-cancel-button" onClick={onCancel}>
        {cancelText}
      </button>
      {showLimitHint && <div>Limit reached</div>}
    </div>
  )
}))

import { useAddActions } from "@/features/todo/hooks/useAddActions"
import { AddTodo } from "./AddTodo"

describe("AddTodo", () => {
  const handlePageChangeMock = jest.fn()
  let user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    user = userEvent.setup()
  })

  it("renders input and Add button", () => {
    ;(useAddActions as jest.Mock).mockReturnValue({
      title: "",
      showLimitHint: false,
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn()
    })

    render(
      <AddTodo
        todosLength={0}
        todosPerPage={5}
        handlePageChange={handlePageChangeMock}
      />
    )

    expect(screen.getByPlaceholderText("Enter new task...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument()
  })

  it("opens modal when clicking Add button", async () => {
    ;(useAddActions as jest.Mock).mockReturnValue({
      title: "test task",
      showLimitHint: false,
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn()
    })

    render(
      <AddTodo
        todosLength={0}
        todosPerPage={5}
        handlePageChange={handlePageChangeMock}
      />
    )

    expect(screen.queryByTestId("modal-input")).not.toBeInTheDocument()

    const addButton = screen.getByRole("button", { name: /add/i })
    await user.click(addButton)

    expect(screen.getByTestId("modal-input")).toBeInTheDocument()
    expect(screen.getByTestId("modal-input")).toHaveValue("test task")
  })

  it("closes modal on Cancel button click", async () => {
    ;(useAddActions as jest.Mock).mockReturnValue({
      title: "test task",
      showLimitHint: false,
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn()
    })

    render(
      <AddTodo
        todosLength={0}
        todosPerPage={5}
        handlePageChange={handlePageChangeMock}
      />
    )

    await user.click(screen.getByRole("button", { name: /add/i }))
    await user.click(screen.getByTestId("modal-cancel-button"))

    expect(screen.queryByTestId("modal-input")).not.toBeInTheDocument()
  })

  it("calls handleSubmit on form submit", () => {
    const handleSubmitMock = jest.fn()

    ;(useAddActions as jest.Mock).mockReturnValue({
      title: "some title",
      showLimitHint: false,
      handleInputChange: jest.fn(),
      handleSubmit: handleSubmitMock
    })

    const { container } = render(
      <AddTodo
        todosLength={0}
        todosPerPage={5}
        handlePageChange={handlePageChangeMock}
      />
    )

    const form = container.querySelector("form")
    expect(form).not.toBeNull()

    fireEvent.submit(form!)

    expect(handleSubmitMock).toHaveBeenCalledTimes(1)
  })
})
