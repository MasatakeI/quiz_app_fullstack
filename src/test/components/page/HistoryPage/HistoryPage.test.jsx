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
import { renderWithStore } from "@/test/utils/renderWithStore";
import userEvent from "@testing-library/user-event";

import * as historyThunks from "@/redux/features/quizHistory/quizHistoryThunks";

const mockNavigate = vi.fn();

vi.mock("react-router", () => {
  const actual = vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
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
    },
  };

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

    const retryButton = screen.getByRole("button", { name: "履歴再読み込み" });
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
