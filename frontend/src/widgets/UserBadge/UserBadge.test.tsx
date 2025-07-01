import { render, screen } from "@testing-library/react"
import { UserBadge } from "./UserBadge.tsx"
import { useProfile } from "@/shared/auth/hooks"
import { useTodosQuery } from "@/features/todo/hooks"

jest.mock("@/features/user/components", () => ({
  UserButton: jest.fn(({ user }) => (
    <div data-testid="mocked-user-button">{user?.name}</div>
  ))
}))

jest.mock("@/shared/auth/hooks", () => ({
  useProfile: jest.fn()
}))
jest.mock("@/features/todo/hooks", () => ({
  useTodosQuery: jest.fn()
}))

describe("UserBadge", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Не отображает UserButton, пока данные профиля и туду загружаются", () => {
    ;(useProfile as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    })
    ;(useTodosQuery as jest.Mock).mockReturnValue({
      isLoading: true
    })

    render(<UserBadge />)

    expect(screen.queryByTestId("mocked-user-button")).not.toBeInTheDocument()
    // Проверка класса opacity
    const container = screen.getByTestId("userbadge-container")
    expect(container).toHaveClass("opacity-0")
  })

  it("Не отображает UserButton, если только туду ещё загружаются", () => {
    ;(useProfile as jest.Mock).mockReturnValue({
      data: { name: "Test User" },
      isLoading: false
    })
    ;(useTodosQuery as jest.Mock).mockReturnValue({
      isLoading: true
    })

    render(<UserBadge />)

    expect(screen.queryByTestId("mocked-user-button")).not.toBeInTheDocument()
    const container = screen.getByTestId("userbadge-container")
    expect(container).toHaveClass("opacity-0")
  })

  it("Не отображает UserButton, если только профиль ещё загружается", () => {
    ;(useProfile as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true
    })
    ;(useTodosQuery as jest.Mock).mockReturnValue({
      isLoading: false
    })

    render(<UserBadge />)

    expect(screen.queryByTestId("mocked-user-button")).not.toBeInTheDocument()
    const container = screen.getByTestId("userbadge-container")
    expect(container).toHaveClass("opacity-0")
  })

  it("Не отображает UserButton, если пользователь не авторизован", () => {
    ;(useProfile as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false
    })
    ;(useTodosQuery as jest.Mock).mockReturnValue({
      isLoading: false
    })

    render(<UserBadge />)

    expect(screen.queryByTestId("mocked-user-button")).not.toBeInTheDocument()
    const container = screen.getByTestId("userbadge-container")
    expect(container).toHaveClass("opacity-0")
  })

  it("Отображает UserButton, когда пользователь авторизован и туду загружены", () => {
    const mockUser = { name: "Test User" }

    ;(useProfile as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false
    })
    ;(useTodosQuery as jest.Mock).mockReturnValue({
      isLoading: false
    })

    render(<UserBadge />)

    const userButton = screen.getByTestId("mocked-user-button")
    expect(userButton).toBeInTheDocument()
    expect(userButton).toHaveTextContent("Test User")

    const container = screen.getByTestId("userbadge-container")
    expect(container).toHaveClass("opacity-100")
  })
})

/*
- Тест UserBadge проверяет корректное отображение UserButton.
- Основан на состояниях загрузки профиля (useProfile) и туду-листа (useTodosQuery).
- Проверяет:
   • UserButton не показывается, пока данные загружаются (любой из двух источников).
   • UserButton не показывается, если пользователь не авторизован.
   • UserButton показывается только тогда, когда профиль загружен, пользователь есть и тудушки загружены.
   • Проверяется визуальное состояние через классы opacity-0 (невидим) и opacity-100 (видим).
- Гарантирует, что UI UserBadge появляется ровно тогда, когда оба источника данных готовы.
*/
