import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
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
jest.mock("@/widgets/TodoLoader", () => ({
  Loader: () => <div data-testid="loader">Загрузка...</div>
}))
jest.mock("@/widgets/ErrorMessage", () => ({
  ErrorMessage: () => <div data-testid="error">Ошибка загрузки</div>
}))
jest.mock("../AddTodo", () => ({
  AddTodo: () => <div data-testid="add-todo">Добавить задачу</div>
}))

// Специальный mock для Pagination, чтобы рендерить кнопки страниц
jest.mock("@/widgets/Pagination", () => {
  return {
    Pagination: ({
      currentPage,
      todosLength,
      setCurrentPage,
      todosPerPage = 5
    }: any) => {
      const totalPages = Math.max(1, Math.ceil(todosLength / todosPerPage))
      return (
        <div data-testid="pagination">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              data-testid={`page-button-${idx + 1}`}
              className={currentPage === idx + 1 ? "active" : ""}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )
    }
  }
})

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
    const items = screen.getAllByTestId("todo-item")
    expect(items.length).toBe(2)
    expect(screen.getByText("Задача 1")).toBeInTheDocument()
    expect(screen.getByText("Задача 2")).toBeInTheDocument()
  })

  it("Рендерит пагинацию с правильным количеством кнопок, если задач больше todosPerPage", () => {
    const todosMockLength = 12
    const todosPerPage = 5
    const currentTodos = Array(todosPerPage)
      .fill(null)
      .map((_, i) => ({
        _id: `${i}`,
        title: `Задача ${i + 1}`
      }))
    const currentPage = 1
    const handlePageChange = jest.fn()

    ;(useTodoListActions as jest.Mock).mockReturnValue({
      error: null,
      loading: false,
      todosLength: todosMockLength,
      currentTodos,
      todosPerPage,
      currentPage,
      handlePageChange
    })

    render(<TodoList />)

    // totalPages = ceil(12/5) = 3
    const pagination = screen.getByTestId("pagination")
    expect(pagination).toBeInTheDocument()

    // Должно быть 3 кнопки: 1,2,3
    const btn1 = screen.getByTestId("page-button-1")
    const btn2 = screen.getByTestId("page-button-2")
    const btn3 = screen.getByTestId("page-button-3")
    expect(btn1).toBeInTheDocument()
    expect(btn2).toBeInTheDocument()
    expect(btn3).toBeInTheDocument()
  })

  it("Клик по кнопке пагинации вызывает handlePageChange с правильным номером страницы", () => {
    const todosMockLength = 12
    const todosPerPage = 5
    const currentTodos = Array(todosPerPage)
      .fill(null)
      .map((_, i) => ({
        _id: `${i}`,
        title: `Задача ${i + 1}`
      }))
    const currentPage = 1
    const handlePageChange = jest.fn()

    ;(useTodoListActions as jest.Mock).mockReturnValue({
      error: null,
      loading: false,
      todosLength: todosMockLength,
      currentTodos,
      todosPerPage,
      currentPage,
      handlePageChange
    })

    render(<TodoList />)

    // Нажимаем на кнопку страницы 2
    const btn2 = screen.getByTestId("page-button-2")
    fireEvent.click(btn2)
    expect(handlePageChange).toHaveBeenCalledWith(2)

    // Нажимаем на кнопку страницы 3
    const btn3 = screen.getByTestId("page-button-3")
    fireEvent.click(btn3)
    expect(handlePageChange).toHaveBeenCalledWith(3)
  })

  it("Не рендерит пагинацию, если задач меньше или равно todosPerPage", () => {
    const todosMockLength = 5
    const todosPerPage = 5
    const currentTodos = Array(todosMockLength)
      .fill(null)
      .map((_, i) => ({
        _id: `${i}`,
        title: `Задача ${i + 1}`
      }))
    const handlePageChange = jest.fn()

    ;(useTodoListActions as jest.Mock).mockReturnValue({
      error: null,
      loading: false,
      todosLength: todosMockLength,
      currentTodos,
      todosPerPage,
      currentPage: 1,
      handlePageChange
    })

    render(<TodoList />)
    // Поскольку todosLength == todosPerPage, пагинация не должна рендериться
    expect(screen.queryByTestId("pagination")).toBeNull()
  })
})
