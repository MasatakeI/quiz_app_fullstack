//src/test/components/widgets/QuizHistory/QuizHistory.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import QuizHistory from "@/components/widgets/QuizHistory/QuizHistory";

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

const mockNavigate = vi.fn();

vi.mock("react-router", () => {
  const actual = vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("QuizHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const commonOption = {
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

  test("historiesがQuizHistoryItemに渡される", () => {
    renderWithStore(<QuizHistory />, commonOption);

    expect(screen.getByText("クイズの記録")).toBeInTheDocument();
    expect(screen.getByText("sports")).toBeInTheDocument();
  });

  test("historiesが0件の時 メッセージとホームへ戻るボタンが表示される", async () => {
    const user = userEvent.setup();
    const { dispatchSpy } = renderWithStore(<QuizHistory />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizHistory: {
          ...quizHistoryInitialState,
        },
      },
    });

    expect(
      screen.getByText(/記録がありません クイズに回答後 記録してください/),
    ).toBeInTheDocument();

    const goHomeButton = screen.getByRole("button", { name: "ホームへ戻る" });

    await user.click(goHomeButton);

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

  test("削除ボタンを押すと Modalが開く", async () => {
    const user = userEvent.setup();

    renderWithStore(<QuizHistory />, commonOption);

    const deleteIcons = screen.getAllByRole("button", { name: "削除" });

    await user.click(deleteIcons[0]);
    expect(screen.getByText(/この記録を削除しますか?/)).toBeInTheDocument();
  });

  test("削除操作で deleteHistoryAsyncが dispatchされる", async () => {
    const user = userEvent.setup();

    const { dispatchSpy } = renderWithStore(<QuizHistory />, commonOption);

    const deleteIcons = screen.getAllByRole("button", { name: "削除" });

    await user.click(deleteIcons[0]);

    const confirmButton = screen.getByRole("button", { name: "削除" });
    await user.click(confirmButton);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  test("削除キャンセル時はdeleteMessageAsyncがdispatchされない", async () => {
    const user = userEvent.setup();

    const { dispatchSpy } = renderWithStore(<QuizHistory />, commonOption);

    const deleteIcons = screen.getAllByRole("button", { name: "削除" });

    for (const button of deleteIcons) {
      await user.click(button);
    }

    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    await user.click(cancelButton);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  test("ホームへ戻るボタンを押すと handleGoHomeが呼ばれる", async () => {
    const user = userEvent.setup();

    const { dispatchSpy } = renderWithStore(<QuizHistory />, commonOption);

    const goHomeButtons = screen.getAllByRole("button", {
      name: "ホームへ戻る",
    });

    await user.click(goHomeButtons[0]);

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
});
