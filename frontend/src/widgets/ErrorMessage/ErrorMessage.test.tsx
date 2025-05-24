import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorMessage } from "./ErrorMessage";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ErrorMessage", () => {
  const useThemeMock = require("next-themes").useTheme;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендерит текст ошибки", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "light" });

    render(<ErrorMessage />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("Отображает картинку для светлой темы", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "light" });

    render(<ErrorMessage />);
    const img = screen.getByAltText("errorImage");
    expect(img).toHaveAttribute("src", "/lightError.png");
  });

  it("Отображает картинку для тёмной темы", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "dark" });

    render(<ErrorMessage />);
    const img = screen.getByAltText("errorImage");
    expect(img).toHaveAttribute("src", "/darkError.png");
  });

  it("Перезагружает страницу при клике на картинку", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "light" });

    const reloadMock = jest.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: reloadMock },
    });

    render(<ErrorMessage />);

    const img = screen.getByAltText("errorImage");
    fireEvent.click(img);

    expect(reloadMock).toHaveBeenCalled();
  });
});
