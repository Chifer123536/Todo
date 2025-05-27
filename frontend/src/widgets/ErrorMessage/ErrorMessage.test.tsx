import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"

jest.mock("next-themes", () => ({
  useTheme: jest.fn()
}))

import { useTheme } from "next-themes"
import { ErrorMessage } from "./ErrorMessage"

describe("ErrorMessage", () => {
  const useThemeMock = useTheme as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Рендерит текст ошибки", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "light" })

    render(<ErrorMessage />)
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
  })

  it("Отображает картинку для светлой темы", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "light" })

    render(<ErrorMessage />)
    const img = screen.getByAltText("errorImage")
    expect(img).toHaveAttribute("src", "/lightError.png")
  })

  it("Отображает картинку для тёмной темы", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "dark" })

    render(<ErrorMessage />)
    const img = screen.getByAltText("errorImage")
    expect(img).toHaveAttribute("src", "/darkError.png")
  })

  it("Перезагружает страницу при клике на картинку", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "light" })

    const reloadMock = jest.fn()
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: reloadMock }
    })

    render(<ErrorMessage />)
    fireEvent.click(screen.getByAltText("errorImage"))
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })
})
