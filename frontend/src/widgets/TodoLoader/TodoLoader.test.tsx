import { render, screen } from "@testing-library/react"
import { Loader } from "./TodoLoader"

jest.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "light"
  })
}))

describe("TodoLoader", () => {
  it("Не отображается, если isLoading = false", () => {
    render(<Loader isLoading={false} />)
    expect(screen.queryAllByTestId("loader-dot")).toHaveLength(0)
  })

  it("Отображает 3 точки, если isLoading = true", () => {
    render(<Loader isLoading={true} />)
    expect(screen.queryAllByTestId("loader-dot")).toHaveLength(3)
  })
})
