import { render, screen } from "@testing-library/react"
import { TodoList } from "./TodoList"

jest.mock("@/features/todo/hooks/useTodoListActions", () => ({
  useTodoListActions: jest.fn()
}))

import { useTodoListActions } from "@/features/todo/hooks/useTodoListActions"

jest.mock("@/widgets/TodoItem", () => ({
  TodoItem: ({ todo }: { todo: any }) => (
    <div data-testid="todo-item">{todo.title}</div>
  )
}))
jest.mock("@/widgets/Pagination", () => ({
  Pagination: ({ currentPage, todosLength }: any) => (
    <div data-testid="pagination">
      Страница: {currentPage}, Всего: {todosLength}
    </div>
  )
}))
jest.mock("@/widgets/TodoLoader", () => ({
  Loader: () => <div data-testid="loader">Загрузка...</div>
}))
jest.mock("@/widgets/ErrorMessage", () => ({
  ErrorMessage: () => <div data-testid="error">Ошибка загрузки</div>
}))
jest.mock("../AddTodo", () => ({
  AddTodo: () => <div data-testid="add-todo">Добавить задачу</div>
}))

describe("TodoList", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("Показывает загрузчик при загрузке", () => {
    ;(useTodoListActions as jest.Mock).mockReturnValue({
      error: null,
      loading: true,
      todosLength: 0,
      currentTodos: [],
      todosPerPage: 5,
      currentPage: 1,
      handlePageChange: jest.fn()
    })

    render(<TodoList />)

    expect(screen.getByTestId("loader")).toBeInTheDocument()
  })

  it("Показывает ошибку, если есть ошибка", () => {
    ;(useTodoListActions as jest.Mock).mockReturnValue({
      error: true,
      loading: false,
      todosLength: 0,
      currentTodos: [],
      todosPerPage: 5,
      currentPage: 1,
      handlePageChange: jest.fn()
    })

    render(<TodoList />)

    expect(screen.getByTestId("error")).toBeInTheDocument()
  })

  it("Показывает текст 'No tasks available', если задач нет", () => {
    ;(useTodoListActions as jest.Mock).mockReturnValue({
      error: null,
      loading: false,
      todosLength: 0,
      currentTodos: [],
      todosPerPage: 5,
      currentPage: 1,
      handlePageChange: jest.fn()
    })

    render(<TodoList />)

    expect(screen.getByText("No tasks available")).toBeInTheDocument()
  })

  it("Рендерит список задач и компонент AddTodo", () => {
    const todosMock = [
      { _id: "1", title: "Задача 1" },
      { _id: "2", title: "Задача 2" }
    ]

    ;(useTodoListActions as jest.Mock).mockReturnValue({
      error: null,
      loading: false,
      todosLength: todosMock.length,
      currentTodos: todosMock,
      todosPerPage: 5,
      currentPage: 1,
      handlePageChange: jest.fn()
    })

    render(<TodoList />)

    expect(screen.getByTestId("add-todo")).toBeInTheDocument()
    expect(screen.getAllByTestId("todo-item").length).toBe(2)
    expect(screen.getByText("Задача 1")).toBeInTheDocument()
    expect(screen.getByText("Задача 2")).toBeInTheDocument()
  })

  it("Рендерит пагинацию, если задач больше todosPerPage", () => {
    const todosMock = Array(6)
      .fill(null)
      .map((_, i) => ({ _id: `${i}`, title: `Задача ${i + 1}` }))

    ;(useTodoListActions as jest.Mock).mockReturnValue({
      error: null,
      loading: false,
      todosLength: todosMock.length,
      currentTodos: todosMock.slice(0, 5),
      todosPerPage: 5,
      currentPage: 1,
      handlePageChange: jest.fn()
    })

    render(<TodoList />)

    expect(screen.getByTestId("pagination")).toBeInTheDocument()
  })
})
