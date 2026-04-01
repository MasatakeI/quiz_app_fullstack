import { describe, test, expect, vi, beforeEach } from "vitest";
import Header from "@/components/layout/Header/Header";

import { screen, waitFor } from "@testing-library/react";

import { renderWithStore } from "@/test/utils/renderWithStore";
import quizProgressReducer, {
  progressInitialState,
} from "@/redux/features/quizProgress/quizProgressSlice";
import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";
import quizSettingsReducer, {
  settingsInitialState,
} from "@/redux/features/quizSettings/quizSettingsSlice";
import quizHistoryReducer, {
  quizHistoryInitialState,
} from "@/redux/features/quizHistory/quizHistorySlice";
import authReducer, { authInitialState } from "@/redux/features/auth/authSlice";

import userEvent from "@testing-library/user-event";
import { act } from "react";
import { MemoryRouter } from "react-router";

const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const commonOption = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
      quizHistory: quizHistoryReducer,
      auth: authReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      quizHistory: { ...quizHistoryInitialState },
      auth: { ...authInitialState },
    },
  };

  test("ロゴをクリックした時 状態がリセットされ ホームに戻る", async () => {
    const user = userEvent.setup();

    renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      commonOption,
    );

    const logoTitle = screen.getByText("クイズアプリ");
    expect(logoTitle).toBeInTheDocument();
    await user.click(logoTitle);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("初期状態では scrolledクラスは付かない", async () => {
    renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      commonOption,
    );
    const header = screen.getByRole("banner");

    expect(header).not.toHaveClass("scrolled");
  });

  test("スクロール時に scrolledクラスが付与される", async () => {
    renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      commonOption,
    );

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });

    const header = screen.getByRole("banner");

    await waitFor(() => {
      expect(header).toHaveClass("scrolled");
    });
  });
  test("スクロールをトップに戻した時に scrolledクラスが除去される", async () => {
    renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      commonOption,
    );

    const header = screen.getByRole("banner");
    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });

    // await waitFor(() => {
    expect(header).toHaveClass("scrolled");
    // });

    act(() => {
      window.scrollY = 0;
      window.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => {
      expect(header).not.toHaveClass("scrolled");
    });
  });

  test("ホームアイコンをクリックすると ホームページへ戻る", async () => {
    const user = userEvent.setup();

    const { dispatchSpy } = renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      commonOption,
    );

    const homeButton = screen.getByRole("button", { name: "ホームへ戻る" });
    expect(homeButton).toBeInTheDocument();
    await user.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "quizContent/resetQuizContent",
      }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "quizSettings/resetQuizSettings",
      }),
    );
  });
  test("ヒストリーアイコンをクリックすると ヒストリーページへ戻る", async () => {
    const user = userEvent.setup();

    renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      commonOption,
    );

    const historyButton = screen.getByRole("button", {
      name: "クイズの記録を見る",
    });
    expect(historyButton).toBeInTheDocument();
    await user.click(historyButton);

    expect(mockNavigate).toHaveBeenCalledWith("/quiz/history");
  });

  test("未ログイン時:ログインボタンをクリックすると AuthModalが開く", async () => {
    const user = userEvent.setup();

    const { dispatchSpy } = renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      commonOption,
    );

    const loginButton = screen.getByRole("button", {
      name: "ログイン",
    });
    expect(loginButton).toBeInTheDocument();
    await user.click(loginButton);

    expect(dispatchSpy).toHaveBeenCalledWith({ type: "auth/openAuthModal" });
  });

  test("ログイン時:ログアウトボタンをクリックすると ログアウトしホームページに遷移する", async () => {
    const user = userEvent.setup();

    renderWithStore(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
      {
        ...commonOption,
        preloadedState: {
          ...commonOption.preloadedState,
          auth: { ...authInitialState, user: { uid: "@@@" } },
        },
      },
    );

    const logoutButton = screen.getByRole("button", {
      name: "ログアウト",
    });
    expect(logoutButton).toBeInTheDocument();
    await user.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("履歴ページにいる時 履歴アイコンがActiveになり ホームアイコンはならない", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/quiz/history"]}>
        <Header />
      </MemoryRouter>,
      commonOption,
    );

    const homeButton = screen.getByRole("button", { name: "ホームへ戻る" });
    const historyButton = screen.getByRole("button", {
      name: "クイズの記録を見る",
    });

    expect(historyButton).toHaveClass("active");
    expect(homeButton).not.toHaveClass("active");
  });
  test("クイズページにいる時 履歴アイコン ホームアイコンともにActiveにならない", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/quiz/play"]}>
        <Header />
      </MemoryRouter>,
      commonOption,
    );

    const homeButton = screen.getByRole("button", { name: "ホームへ戻る" });
    const historyButton = screen.getByRole("button", {
      name: "クイズの記録を見る",
    });

    expect(historyButton).not.toHaveClass("active");
    expect(homeButton).not.toHaveClass("active");
  });
});
