//ResultButtonContainer.test.jsx

import { screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

import ResultButtonContainer from "@/components/widgets/QuizResult/ResultButtonContainer";

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

const mockOnRetry = vi.fn();
const mockOnNavigate = vi.fn();
const mockOnNavigateToHistory = vi.fn();
const mockOnSaveHistory = vi.fn();

vi.mock("@/models/QuizHistoryModel", () => ({
  addHistory: vi.fn(),
}));

describe("ResultButtonContainer", () => {
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
  describe("ボタンが表示され クリック時に対応する関数が呼ばれる", () => {
    test("未ログイン時", async () => {
      const user = userEvent.setup();

      renderWithStore(
        <ResultButtonContainer
          onNavigate={mockOnNavigate}
          onRetry={mockOnRetry}
          // onNavigateToHistory={mockOnNavigateToHistory}
          onSaveHistory={mockOnSaveHistory}
        />,
        commonOption,
      );

      const retryButton = screen.getByRole("button", {
        name: "同じ条件でもう1度",
      });
      expect(retryButton).toBeInTheDocument();

      const backToHomeButton = screen.getByRole("button", {
        name: "ホームへ戻る",
      });
      expect(backToHomeButton).toBeInTheDocument();

      const loginButton = screen.getByRole("button", {
        name: "ログインして保存",
      });
      expect(loginButton).toBeInTheDocument();

      await user.click(retryButton);
      expect(mockOnRetry).toHaveBeenCalledTimes(1);

      await user.click(backToHomeButton);
      expect(mockOnNavigate).toHaveBeenCalledTimes(1);
      await user.click(loginButton);
      expect(mockOnSaveHistory).toHaveBeenCalled();

      expect(screen.getByText("ログインして保存")).toBeInTheDocument();

      // 表示されてはいけないボタンをチェック
      expect(screen.queryByText("記録を見る")).not.toBeInTheDocument();
    });

    test("ログイン時", async () => {
      const user = userEvent.setup();

      renderWithStore(
        <ResultButtonContainer
          onNavigate={mockOnNavigate}
          onRetry={mockOnRetry}
          onNavigateToHistory={mockOnNavigateToHistory}
          // onSaveHistory={mockOnSaveHistory}
        />,
        {
          ...commonOption,
          preloadedState: {
            ...commonOption.preloadedState,
            auth: { user: { uid: "@@@" } },
          },
        },
      );

      const retryButton = screen.getByRole("button", {
        name: "同じ条件でもう1度",
      });
      expect(retryButton).toBeInTheDocument();

      const backToHomeButton = screen.getByRole("button", {
        name: "ホームへ戻る",
      });
      expect(backToHomeButton).toBeInTheDocument();

      const goToHistoryButton = screen.getByRole("button", {
        name: "記録を見る",
      });
      expect(goToHistoryButton).toBeInTheDocument();

      await user.click(retryButton);
      expect(mockOnRetry).toHaveBeenCalledTimes(1);

      await user.click(backToHomeButton);
      expect(mockOnNavigate).toHaveBeenCalledTimes(1);
      await user.click(goToHistoryButton);
      expect(mockOnNavigateToHistory).toHaveBeenCalledTimes(1);

      expect(screen.getByText("記録を見る")).toBeInTheDocument();

      // 表示されてはいけないボタンをチェック
      expect(screen.queryByText("ログインして保存")).not.toBeInTheDocument();
    });
  });
});
