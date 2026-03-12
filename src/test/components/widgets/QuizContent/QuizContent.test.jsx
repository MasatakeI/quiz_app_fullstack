// src/test/components/widgets/QuizContent/QuizContent.test.jsx

import { screen } from "@testing-library/react";
import { describe, test, vi, expect, beforeEach } from "vitest";

import QuizContent from "@/components/widgets/QuizContent/QuizContent";

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
import userEvent from "@testing-library/user-event";

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

describe("QuizContent.jsxのテスト", () => {
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
      quizContent: {
        ...contentInitialState,

        quizzes: [
          {
            question: "test1?",
            correctAnswer: "True",
            incorrectAnswers: ["False"],
            difficulty: "easy",
          },
          {
            question: "test2?",
            correctAnswer: "True",
            incorrectAnswers: ["False"],
            difficulty: "easy",
          },
        ],
      },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      quizHistory: { ...quizHistoryInitialState },
    },
  };

  test("shuffledAnswersがQuizAnswersに渡される", () => {
    renderWithStore(<QuizContent />, commonOption);

    expect(screen.getByRole("button", { name: "A. True" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "B. False" }),
    ).toBeInTheDocument();
  });

  test("回答ボタンをクリックすると判定が行われて,次へボタンが表示される", async () => {
    const user = userEvent.setup();

    renderWithStore(<QuizContent />, commonOption);

    const answerButton = screen.getByRole("button", { name: "A. True" });

    await user.click(answerButton);

    expect(screen.getByRole("button", { name: "次へ" })).toBeInTheDocument();
    expect(screen.getByText(/正解!/i)).toBeInTheDocument();
  });

  test("不正解を選択した時、適切にアラートが表示される", async () => {
    const user = userEvent.setup();
    renderWithStore(<QuizContent />, commonOption);

    // 不正解ボタンをクリック（Aが正解ならBをクリック）
    const incorrectButton = screen.getByRole("button", { name: "B. False" });
    await user.click(incorrectButton);

    // AnswerAlert内に「不正解」またはそれに準ずるテキストが出るか確認
    // (実装によりますが、QuizAnswerAlert内の条件分岐をテストできます)
    expect(screen.getByText(/不正解/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "次へ" })).toBeInTheDocument();
  });

  test("quizResultがある時,次へボタンを押すと,次の問題が表示される", async () => {
    const user = userEvent.setup();
    renderWithStore(<QuizContent />, commonOption);

    await user.click(screen.getByRole("button", { name: "A. True" }));
    const goToNextButton = screen.getByRole("button", { name: "次へ" });
    await user.click(goToNextButton);
    expect(screen.getByText("Q2. test2?")).toBeInTheDocument();
  });

  test("回答後は選択肢のボタンがdisabledになる", async () => {
    const user = userEvent.setup();

    renderWithStore(<QuizContent />, commonOption);
    const answerButton = screen.getByRole("button", { name: "A. True" });
    const falseButton = screen.getByRole("button", { name: "B. False" });
    await user.click(answerButton);

    expect(answerButton).not.toBeDisabled();
    expect(falseButton).toBeDisabled();
  });

  describe("最後の問題に回答した後,問題数によってcurrentIndexが終了を表す値になる", () => {
    test.each([
      {
        title: "4択 10問",
        numberOfQuestion: 10,
        finalIndex: 9,
      },
      {
        title: "2択 5問",
        numberOfQuestion: 5,
        finalIndex: 4,
      },
    ])("$title の時", async ({ numberOfQuestion, finalIndex }) => {
      const user = userEvent.setup();

      const { store } = renderWithStore(<QuizContent />, {
        ...commonOption,
        preloadedState: {
          ...commonOption.preloadedState,

          quizContent: {
            ...contentInitialState,
            quizzes: Array(numberOfQuestion).fill({
              question: "question",
              correctAnswer: "True",
              incorrectAnswers: ["False"],
            }),
          },
          quizProgress: { ...progressInitialState, currentIndex: finalIndex },
        },
      });

      const answerButton = screen.getByRole("button", { name: "A. True" });
      await user.click(answerButton);

      const goToNextButton = screen.getByRole("button", { name: "次へ" });
      await user.click(goToNextButton);

      expect(store.getState().quizProgress.currentIndex).toBe(finalIndex + 1);
    });
  });

  test("最初の問題で進捗バーが正しく計算されているか", () => {
    renderWithStore(<QuizContent />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: {
          ...contentInitialState,
          quizzes: [{ question: "test1" }, { question: "test2" }],
        },
        quizProgress: {
          progressInitialState,
          currentIndex: 1,
        },
      },
    });

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "50");
  });

  test("クイズデータが空の場合、何も表示されない（またはエラーにならない）", () => {
    const emptyOption = {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: { ...contentInitialState, quizzes: [] },
        quizProgress: { ...progressInitialState, currentIndex: 0 },
      },
    };

    const { container } = renderWithStore(<QuizContent />, emptyOption);

    // 1. タイトルや問題文などのテキストが存在しないことを確認
    expect(screen.queryByText(/Q\d\./)).not.toBeInTheDocument();

    // 2. あるいは、containerの中にある特定の子要素（QuizContentViewの中身など）が空であることを確認
    const content = container.querySelector(".quiz-content");
    expect(content).toBeInTheDocument();
    // 子要素のテキストコンテンツが空であることをチェック
    expect(content.textContent).toBe("");
  });
});
