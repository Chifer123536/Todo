import { render, screen } from "@testing-library/react";
import { UserBadge } from "./UserBadge";
import { useProfile } from "@/shared/auth/hooks";
import { useTodosQuery } from "@/features/todo/hooks";

jest.mock("@/features/user/components", () => ({
  UserButton: jest.fn(() => <div>Mocked UserButton</div>),
}));

jest.mock("@/shared/auth/hooks", () => ({
  useProfile: jest.fn(),
}));
jest.mock("@/features/todo/hooks", () => ({
  useTodosQuery: jest.fn(),
}));

describe("UserBadge", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Отображает UserButton, когда пользователь загружен и данные получены", () => {
    (useProfile as jest.Mock).mockReturnValue({
      data: { name: "Test User" },
      isLoading: false,
    });
    (useTodosQuery as jest.Mock).mockReturnValue({
      isLoading: false,
    });

    render(<UserBadge />);
    expect(screen.getByText("Mocked UserButton")).toBeInTheDocument();
  });

  it("Не отображает UserButton, пока данные загружаются", () => {
    (useProfile as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });
    (useTodosQuery as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    render(<UserBadge />);
    expect(screen.queryByText("Mocked UserButton")).not.toBeInTheDocument();
  });

  it("Не отображает UserButton, если пользователь не авторизован", () => {
    (useProfile as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });
    (useTodosQuery as jest.Mock).mockReturnValue({
      isLoading: false,
    });

    render(<UserBadge />);
    expect(screen.queryByText("Mocked UserButton")).not.toBeInTheDocument();
  });
});
