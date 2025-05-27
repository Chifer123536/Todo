import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Pagination } from "./Pagination"

describe("Pagination", () => {
  it("Рендерит правильное количество кнопок, если больше 5 задач.", () => {
    render(
      <Pagination currentPage={1} todosLength={12} setCurrentPage={() => {}} />
    )

    // 12 задач, значит 3 страницы.
    const buttons = screen.getAllByRole("button")
    expect(buttons.length).toBe(3)
  })

  it("Подсвечивает текущую страницу", () => {
    render(
      <Pagination currentPage={2} todosLength={15} setCurrentPage={() => {}} />
    )

    const activeButton = screen.getByText("2")
    expect(activeButton.className).toMatch(/active/)
  })

  it("Вызывает setCurrentPage при клике на кнопку", async () => {
    const setCurrentPageMock = jest.fn()

    render(
      <Pagination
        currentPage={1}
        todosLength={10}
        setCurrentPage={setCurrentPageMock}
      />
    )

    const secondPageBtn = screen.getByText("2")
    await userEvent.click(secondPageBtn)

    expect(setCurrentPageMock).toHaveBeenCalledTimes(1)
    expect(setCurrentPageMock).toHaveBeenCalledWith(2)
  })
})
