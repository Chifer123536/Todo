import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "./TodoItem";

jest.mock("@/features/todo/hooks/useItemActions");
jest.mock("@/widgets/ModalCard", () => ({
  ModalCard: ({ isOpen, onClose, children }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <button onClick={onClose}>Закрыть</button>
        {children}
      </div>
    ) : null,
  ModalContent: ({
    value,
    onChange,
    onSave,
    onCancel,
    placeholder,
    cancelText,
    accepText,
  }: any) => (
    <div>
      <textarea
        data-testid="textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button onClick={onCancel}>{cancelText}</button>
      <button onClick={onSave}>{accepText}</button>
    </div>
  ),
}));

import { useItemActions } from "@/features/todo/hooks/useItemActions";

const mockSetIsModalOpen = jest.fn();

describe("TodoItem", () => {
  const todo = {
    _id: "1",
    clientId: "c1",
    title: "Тестовая задача",
    completed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useItemActions as jest.Mock).mockReturnValue({
      isModalOpen: false,
      setIsModalOpen: mockSetIsModalOpen,
      editedTitle: todo.title,
      showLimitHint: false,
      isEditing: false,
      isDeleting: false,
      handleChange: jest.fn(),
      handleDelete: jest.fn(),
      handleEditSave: jest.fn(),
      handleTextareaChange: jest.fn(),
    });
  });

  it("Рендерит заголовок задачи", () => {
    render(<TodoItem todo={todo} />);
    expect(screen.getByText("Тестовая задача")).toBeInTheDocument();
  });

  it("Открывает модалку при клике по заголовку", () => {
    render(<TodoItem todo={todo} />);
    fireEvent.click(screen.getByText("Тестовая задача"));
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(true);
  });

  it("Отображает модалку, если isModalOpen = true", () => {
    (useItemActions as jest.Mock).mockReturnValue({
      isModalOpen: true,
      setIsModalOpen: mockSetIsModalOpen,
      editedTitle: todo.title,
      showLimitHint: false,
      isEditing: false,
      isDeleting: false,
      handleChange: jest.fn(),
      handleDelete: jest.fn(),
      handleEditSave: jest.fn(),
      handleTextareaChange: jest.fn(),
    });

    render(<TodoItem todo={todo} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("textarea")).toHaveValue("Тестовая задача");
  });
});
