//AppRoutes.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { screen } from "@testing-library/react";

import AppRoutes from "@/AppRoutes";

import { renderWithStore } from "./utils/renderWithStore";

import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer, {
  progressInitialState,
} from "@/redux/features/quizProgress/quizProgressSlice";
import quizSettingsReducer, {
  settingsInitialState,
} from "@/redux/features/quizSettings/quizSettingsSlice";
import snackbarReducer, {
  snackbarInitialState,
} from "@/redux/features/snackbar/snackbarSlice";

import quizHistoryReducer, {
  quizHistoryInitialState,
} from "@/redux/features/quizHistory/quizHistorySlice";
import authReducer, { authInitialState } from "@/redux/features/auth/authSlice";

vi.mock("@/components/page/HomePage/HomePage", () => ({
  default: () => <div data-testid="home-page">HomePage</div>,
}));
vi.mock("@/components/page/QuizPage/QuizPage", () => ({
  default: () => <div data-testid="quiz-page">QuizPage</div>,
}));
vi.mock("@/components/page/HistoryPage/HistoryPage", () => ({
  default: () => <div data-testid="history-page">HistoryPage</div>,
}));

describe("AppRoutes.jsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const commonOptions = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
      snackbar: snackbarReducer,
      quizHistory: quizHistoryReducer,
      auth: authReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      snackbar: { ...snackbarInitialState },
      quizHistory: { ...quizHistoryInitialState },
      auth: { ...authInitialState },
    },
  };

  test("初期パス / HomePageが描画される QuizPageは描画されない", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
      commonOptions,
    );

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("quiz-page")).not.toBeInTheDocument();
  });

  test("/quiz/play/:category にアクセスすると QuizPage が表示される", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/quiz/play/sports"]}>
        <AppRoutes />
      </MemoryRouter>,
      commonOptions,
    );

    expect(screen.getByTestId("quiz-page")).toBeInTheDocument();
  });

  test("ログインした状態で /quiz/history にアクセスすると HistoryPage が表示される", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/quiz/history"]}>
        <AppRoutes />
      </MemoryRouter>,
      {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          auth: { ...authInitialState, user: { uid: "aaa" } },
        },
      },
    );

    expect(screen.getByTestId("history-page")).toBeInTheDocument();
    expect(screen.queryByTestId("quiz-page")).not.toBeInTheDocument();
  });

  test("存在しないパスにアクセスした時HomePageにリダイレクトする", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/@@@"]}>
        <AppRoutes />
      </MemoryRouter>,
      commonOptions,
    );

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  test("リダイレクトの分岐網羅: 複数の不正なパスで検証", () => {
    const { unmount } = renderWithStore(
      <MemoryRouter initialEntries={["/not-found-123"]}>
        <AppRoutes />
      </MemoryRouter>,
      commonOptions,
    );
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    unmount(); // 一度クリーンアップして別の分岐へ

    renderWithStore(
      <MemoryRouter initialEntries={["/invalid/path/test"]}>
        <AppRoutes />
      </MemoryRouter>,
      commonOptions,
    );
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
});
