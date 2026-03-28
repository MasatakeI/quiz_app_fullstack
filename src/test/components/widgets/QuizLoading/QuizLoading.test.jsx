// src/test/components/widgets/QuizLoading/QuizLoading

import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";

import QuizLoading from "@/components/widgets/QuizLoading/QuizLoading";

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

import { renderWithStore } from "@/test/utils/renderWithStore";

import * as quizContentThunks from "@/redux/features/quizContent/quizContentThunks";
import { useSearchParams } from "react-router";

vi.mock("@/components/common/LoadingSpinner/LoadingSpinner", () => ({
  default: () => <div data-testid="loading-spinner"></div>,
}));

const { mockUseSearchParams, mockNavigate } = vi.hoisted(() => ({
  mockUseSearchParams: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ category: "sports" }),
    // 2. 定義した mock 関数を返すようにする
    useSearchParams: mockUseSearchParams,
  };
});

describe("QuizLoading.jsxのテスト", () => {
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
      quizContent: { ...contentInitialState, quizzes: [] },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      quizHistory: { ...quizHistoryInitialState },
      auth: { ...authInitialState },
    },
  };

  test("正常系：データ取得成功時は何も表示しない", () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams("type=multiple&difficulty=easy&amount=10"),
      vi.fn(),
    ]);
    const { container } = renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { isLoading: false, fetchError: null },
      },
    });

    expect(container.firstChild).toBe(null);
  });

  test("isLoading===trueの時,LoadingSpinnerが表示される", () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams("type=multiple&difficulty=easy&amount=10"),
      vi.fn(),
    ]);
    renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { isLoading: true },
      },
    });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("isLoading===falseでfetchErrorがある時,メッセージ 再読み込みボタン ホームへ戻るボタンが表示される", () => {
    renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: {
          isLoading: false,
          fetchError: { message: "読み込みに失敗しました" },
        },
      },
    });

    const reloadButton = screen.getByRole("button", { name: "再読み込み" });
    const goHomeButton = screen.getByRole("button", {
      name: "クイズ一覧へ戻る",
    });

    expect(screen.getByText("読み込みに失敗しました")).toBeInTheDocument();
    expect(reloadButton).toBeInTheDocument();
    expect(goHomeButton).toBeInTheDocument();
  });

  test("再読み込みボタンを押すとfetchQuizzesAsyncがdispatchされる", async () => {
    const { dispatchSpy } = renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { isLoading: false, fetchError: { message: "エラー" } },
      },
    });

    const fetchSpy = vi.spyOn(quizContentThunks, "fetchQuizzesAsync");

    const user = userEvent.setup();
    const reloadButton = screen.getByRole("button", { name: "再読み込み" });
    await user.click(reloadButton);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
    expect(fetchSpy).toHaveBeenCalledWith({
      category: "sports",
      type: "multiple",
      difficulty: "easy",
      amount: "10",
    });
  });

  test("パラメータが欠落している状態で再読み込みを押しても動作する", async () => {
    const user = userEvent.setup();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(""),
      vi.fn(),
    ]);

    const { dispatchSpy } = renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { isLoading: false, fetchError: { message: "エラー" } },
      },
    });

    const reloadButton = screen.getByRole("button", { name: "再読み込み" });
    await user.click(reloadButton);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  test("ホームへ戻るボタンを押すとhandleGoHomeが呼ばれる", async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams("type=multiple&difficulty=easy&amount=10"),
      vi.fn(),
    ]);
    const { dispatchSpy } = renderWithStore(<QuizLoading />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { isLoading: false, fetchError: { message: "エラー" } },
        quizSettings: {
          category: "sports",
          type: "multiple",
          difficulty: "easy",
          amount: "10",
        },
      },
    });

    const user = userEvent.setup();
    const goHomeButton = screen.getByRole("button", {
      name: "クイズ一覧へ戻る",
    });
    await user.click(goHomeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "quizContent/resetQuizContent",
    });
  });
});
