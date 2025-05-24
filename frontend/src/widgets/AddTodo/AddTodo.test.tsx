import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTodo } from "./AddTodo";

jest.mock("@/shared/todo/hooks/useHotkey", () => ({
  useHotkey: jest.fn(),
}));

jest.mock("@/features/todo/hooks/useAddActions", () => ({
  useAddActions: jest.fn(),
}));

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
    accepText,
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
  ),
}));

describe("AddTodo", () => {
  const handlePageChangeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендерит input и кнопку Add", () => {
    const useAddActions =
      require("@/features/todo/hooks/useAddActions").useAddActions;
    useAddActions.mockReturnValue({
      title: "",
      showLimitHint: false,
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn(),
    });

    render(
      <AddTodo
        todosLength={0}
        todosPerPage={5}
        handlePageChange={handlePageChangeMock}
      />,
    );

    expect(
      screen.getByPlaceholderText("Enter new task..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("Открывает модалку при клике на Add", async () => {
    const useAddActions =
      require("@/features/todo/hooks/useAddActions").useAddActions;
    useAddActions.mockReturnValue({
      title: "test task",
      showLimitHint: false,
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn(),
    });

    render(
      <AddTodo
        todosLength={0}
        todosPerPage={5}
        handlePageChange={handlePageChangeMock}
      />,
    );

    expect(screen.queryByTestId("modal-input")).not.toBeInTheDocument();

    const addButton = screen.getByRole("button", { name: /add/i });
    await userEvent.click(addButton);

    expect(screen.getByTestId("modal-input")).toBeInTheDocument();
    expect(screen.getByTestId("modal-input")).toHaveValue("test task");
  });

  it("Закрывает модалку при клике Cancel", async () => {
    const useAddActions =
      require("@/features/todo/hooks/useAddActions").useAddActions;
    useAddActions.mockReturnValue({
      title: "test task",
      showLimitHint: false,
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn(),
    });

    render(
      <AddTodo
        todosLength={0}
        todosPerPage={5}
        handlePageChange={handlePageChangeMock}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    const cancelButton = screen.getByTestId("modal-cancel-button");
    await userEvent.click(cancelButton);

    expect(screen.queryByTestId("modal-input")).not.toBeInTheDocument();
  });

  it("Вызывает handleSubmit при сабмите формы", () => {
    const handleSubmitMock = jest.fn();
    const handleInputChangeMock = jest.fn();

    const useAddActions =
      require("@/features/todo/hooks/useAddActions").useAddActions;
    useAddActions.mockReturnValue({
      title: "some title",
      showLimitHint: false,
      handleInputChange: handleInputChangeMock,
      handleSubmit: handleSubmitMock,
    });

    const { container } = render(
      <AddTodo
        todosLength={0}
        todosPerPage={5}
        handlePageChange={handlePageChangeMock}
      />,
    );

    const form = container.querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.submit(form!);

    expect(handleSubmitMock).toHaveBeenCalled();
  });
});
