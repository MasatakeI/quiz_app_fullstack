import { describe, test, vi, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";

import HistoryPage from "@/components/page/HistoryPage/HistoryPage";

import quizSettingsReducer, {
  settingsInitialState,
} from "@/redux/features/quizSettings/quizSettingsSlice";
import quizHistoryReducer, {
  quizHistoryInitialState,
} from "@/redux/features/quizHistory/quizHistorySlice";
import quizProgressReducer, {
  progressInitialState,
} from "@/redux/features/quizProgress/quizProgressSlice";
import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";
import authReducer, { authInitialState } from "@/redux/features/auth/authSlice";

import { renderWithStore } from "@/test/utils/renderWithStore";
import userEvent from "@testing-library/user-event";

import * as historyThunks from "@/redux/features/quizHistory/quizHistoryThunks";

const mockNavigate = vi.fn();

vi.mock("react-router", () => {
  const actual = vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ category: "sports" }),
    useSearchParams: () => [
      new URLSearchParams("type=boolean&difficulty=easy&amount=5"),
      vi.fn(),
    ],
  };
});

describe("HistoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOptions = {
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
      quizHistory: {
        ...quizHistoryInitialState,
        histories: [
          {
            id: 1,
            date: "2020/01/01",
            category: "sports",
            score: 3,
            totalQuestions: 10,
            accuracy: 0.3,
            difficulty: "easy",
          },
        ],
      },
      auth: { ...authInitialState, user: { uid: "@@@" } },
    },
  };

  describe("ログイン時:", () => {
    test("fetchHistoryAsyncが呼ばれる", () => {
      const { dispatchSpy } = renderWithStore(<HistoryPage />, commonOptions);

      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
    });

    test("isLoading=true の時 LoadingSpinnerが表示される", () => {
      renderWithStore(<HistoryPage />, {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizHistory: {
            ...commonOptions.preloadedState.quizHistory,
            isLoading: true,
          },
        },
      });

      expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    test("errorがある時 error.messageと 再読み込みボタンが表示される", async () => {
      const user = userEvent.setup();

      const { dispatchSpy } = renderWithStore(<HistoryPage />, {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizHistory: {
            isLoading: false,
            error: { message: "エラー" },
            histories: [{ id: 1, category: "sports" }],
            canPost: true,
            isDeleting: false,
          },
        },
      });

      const errorMessage = await screen.findByText(/エラー/);
      expect(errorMessage).toBeInTheDocument();

      const retryButton = screen.getByRole("button", {
        name: "履歴再読み込み",
      });
      expect(retryButton).toBeInTheDocument();

      await user.click(retryButton);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    test("通常時は QuizHistoryが表示される", async () => {
      vi.spyOn(historyThunks, "fetchHistoriesAsync").mockReturnValue({
        type: "none",
      });
      renderWithStore(<HistoryPage />, {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizHistory: {
            isLoading: false, // 明示的に false
            error: null, // エラーもない状態
            histories: [
              {
                id: 1,
                category: "sports",
                date: "2020/01/01",
                score: 3,
                totalQuestions: 10,
              },
            ],
            canPost: true,
            isDeleting: false,
          },
        },
      });

      const title = await screen.findByText(
        "クイズの記録",
        {},
        { timeout: 2000 },
      );
      expect(title).toBeInTheDocument();
    });
  });

  describe("非ログイン時", () => {
    test(" メッセージと ボタンが表示され 対応する関数が呼ばれる", async () => {
      const user = userEvent.setup();
      const { dispatchSpy } = renderWithStore(<HistoryPage />, {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          auth: { ...authInitialState, user: null },
        },
      });

      const errorMessage = screen.getByText("履歴を見るにはログインが必要です");
      const errorMessage2 = screen.getByText(
        "アカウントを作成すると履歴を保存できます",
      );
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage2).toBeInTheDocument();

      const openModalButton = screen.getByRole("button", {
        name: "新規登録 / ログイン",
      });
      expect(openModalButton).toBeInTheDocument();
      await user.click(openModalButton);
      expect(dispatchSpy).toHaveBeenCalledWith({ type: "auth/openAuthModal" });

      const goHomeButton = screen.getByRole("button", {
        name: "クイズ一覧へ戻る",
      });
      expect(goHomeButton).toBeInTheDocument();
      await user.click(goHomeButton);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
