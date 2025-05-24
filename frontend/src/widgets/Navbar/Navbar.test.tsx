import { Navbar } from "./Navbar";
import { render, screen } from "@testing-library/react";

describe("Navbar", () => {
  it("Рендерит навбар", () => {
    render(<Navbar />);

    const logoLight = screen.getByAltText("logo light");
    const logoDark = screen.getByAltText("logo dark");
    const title = screen.getByText("Todo List");

    expect(logoLight).toBeInTheDocument();
    expect(logoDark).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  it("Логотип соответствует теме", () => {
    render(<Navbar />);

    const logoLight = screen.getByAltText("logo light");
    const logoDark = screen.getByAltText("logo dark");

    expect(logoLight.getAttribute("src")).toBe("/darkLogo.png");
    expect(logoDark.getAttribute("src")).toBe("/lightLogo.png");
  });
});
