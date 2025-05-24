import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ModalCard } from "./ModalCard";
import { ModalContent } from "./ModalContent";

describe("ModalCard", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
  });

  it("Не рендерит модалку, если isOpen=false", () => {
    const { container } = render(
      <ModalCard isOpen={false} onClose={onCloseMock}>
        <div>Test Content</div>
      </ModalCard>,
    );

    expect(container.firstChild).toBeNull();
  });

  it("Рендерит модалку, если isOpen=true", () => {
    render(
      <ModalCard isOpen={true} onClose={onCloseMock}>
        <div>Test Content</div>
      </ModalCard>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("Вызывает onClose при клике на кнопку закрытия", async () => {
    render(
      <ModalCard isOpen={true} onClose={onCloseMock}>
        <div>Content</div>
      </ModalCard>,
    );

    const closeBtn = screen.getByRole("button", { name: /✖/ });
    await userEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("Вызывает onClose при клике вне модального окна (на оверлей)", () => {
    render(
      <ModalCard isOpen={true} onClose={onCloseMock}>
        <div>Content</div>
      </ModalCard>,
    );

    // Клик вне модалки
    fireEvent.mouseDown(
      screen.getByText("Content").parentElement!.parentElement!,
    );
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("Не вызывает onClose при клике внутри модального окна", () => {
    render(
      <ModalCard isOpen={true} onClose={onCloseMock}>
        <div>Content</div>
      </ModalCard>,
    );

    // Клик внутри модалки
    fireEvent.mouseDown(screen.getByText("Content"));
    expect(onCloseMock).not.toHaveBeenCalled();
  });
});

describe("ModalContent", () => {
  const onChangeMock = jest.fn();
  const onSaveMock = jest.fn();
  const onCancelMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
    onSaveMock.mockClear();
    onCancelMock.mockClear();
  });

  it("Рендерит textarea с переданным значением и placeholder", () => {
    render(
      <ModalContent
        value="text"
        onChange={onChangeMock}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        limit={10}
        showLimitHint={false}
        isLoading={false}
        placeholder="Enter new task..."
        cancelText="Cancel"
        accepText="Save"
      />,
    );

    const textarea = screen.getByPlaceholderText(
      "Enter new task...",
    ) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe("text");
  });

  it("Вызывает onChange при изменении текста", async () => {
    render(
      <ModalContent
        value=""
        onChange={onChangeMock}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        limit={10}
        showLimitHint={false}
        isLoading={false}
        cancelText="Cancel"
        accepText="Save"
      />,
    );

    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "abc");
    expect(onChangeMock).toHaveBeenCalled();
  });

  it("Отображает подсказку лимита, если showLimitHint=true", () => {
    render(
      <ModalContent
        value=""
        onChange={onChangeMock}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        limit={15}
        showLimitHint={true}
        isLoading={false}
        cancelText="Cancel"
        accepText="Save"
      />,
    );

    expect(screen.getByText(/Max length: 15/)).toBeVisible();
  });

  it("Вызывает onCancel при клике на кнопку отмены", async () => {
    render(
      <ModalContent
        value=""
        onChange={onChangeMock}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        limit={10}
        showLimitHint={false}
        isLoading={false}
        cancelText="Cancel"
        accepText="Save"
      />,
    );

    const cancelBtn = screen.getByText("Cancel");
    await userEvent.click(cancelBtn);
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it("Вызывает onSave при клике на кнопку сохранения", async () => {
    render(
      <ModalContent
        value=""
        onChange={onChangeMock}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        limit={10}
        showLimitHint={false}
        isLoading={false}
        cancelText="Cancel"
        accepText="Save"
      />,
    );

    const saveBtn = screen.getByText("Save");
    await userEvent.click(saveBtn);
    expect(onSaveMock).toHaveBeenCalledTimes(1);
  });

  it("Отключает textarea и кнопки, если isLoading=true", () => {
    render(
      <ModalContent
        value=""
        onChange={onChangeMock}
        onSave={onSaveMock}
        onCancel={onCancelMock}
        limit={10}
        showLimitHint={false}
        isLoading={true}
        cancelText="Cancel"
        accepText="Save"
      />,
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByText("Cancel")).toBeDisabled();
    expect(screen.getByText("Save")).toBeDisabled();
  });
});
