// page/QuizPage/QuizPage.test.jsx

import { screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";
import { progressInitialState } from "@/redux/features/quizProgress/quizProgressSlice";
import quizContentReducer from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer from "@/redux/features/quizProgress/quizProgressSlice";

import QuizPage from "../../../../components/page/QuizPage/QuizPage";
import { renderWithStore } from "@/test/utils/renderWithStore";

import * as quizContentThunk from "@/redux/features/quizContent/quizContentThunks";

vi.mock("@/components/widgets/QuizLoading/QuizLoading", () => ({
  default: () => <div>Loading</div>,
}));

vi.mock("../../../../components/widgets/QuizContent/QuizContent", () => ({
  default: () => <div>Content</div>,
}));

vi.mock("@/components/widgets/QuizResult/QuizResult", () => ({
  default: () => <div>Result</div>,
}));

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

describe("QuizPage.jsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(quizContentThunk, "fetchQuizzesAsync").mockReturnValue({
      type: "mock",
    });
  });

  const commonOption = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
    },
    preloadedState: {
      quizContent: {
        ...contentInitialState,
        quizzes: Array(5).fill({ question: "test" }),
        isLoading: false,
        fetchError: null,
      },
      quizProgress: { ...progressInitialState },
    },
  };

  test("マウント時 fetchQuizzesAsync が 正しい引数で呼ばれる", async () => {
    const fetchSpy = vi.spyOn(quizContentThunk, "fetchQuizzesAsync");
    renderWithStore(<QuizPage />, commonOption);

    expect(fetchSpy).toHaveBeenCalledWith({
      category: "sports",
      type: "boolean",
      difficulty: "easy",
      amount: "5",
    });
  });

  test("beforeunload:クイズ進行中の場合 preventDefaultが呼ばれる", async () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    renderWithStore(<QuizPage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizProgress: { currentIndex: 1 },
      },
    });

    expect(addSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));

    const handler = addSpy.mock.calls.find(
      (call) => call[0] === "beforeunload",
    )[1];

    const event = { preventDefault: vi.fn(), returnVaue: "" };

    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();

    expect(event.returnVaue).toBe("");
  });
  test("beforeunload:クイズ終了後の場合 preventDefaultが呼ばれない", async () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    renderWithStore(<QuizPage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizProgress: { currentIndex: 5 },
      },
    });

    expect(addSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));

    const handler = addSpy.mock.calls.find(
      (call) => call[0] === "beforeunload",
    )[1];

    const event = { preventDefault: vi.fn(), returnVaue: "init" };

    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();

    expect(event.returnVaue).toBe("init");
  });

  test("アンマウント時 イベントリスナーが削除される", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderWithStore(<QuizPage />, commonOption);

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function),
    );
  });

  test("isLoading=trueまたはfetchErrorがあるときQuizLoadingが表示される", () => {
    renderWithStore(<QuizPage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: {
          ...commonOption.preloadedState.quizContent,
          isLoading: true,
          fetchError: { message: "エラー" },
        },
      },
    });

    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  test("quizFinished=trueの時QuizResultが表示される", () => {
    renderWithStore(<QuizPage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: {
          ...commonOption.preloadedState.quizContent,
          isLoading: false,
          fetchError: null,
        },
        quizProgress: {
          ...commonOption.preloadedState.quizProgress,
          currentIndex: 5,
        },
      },
    });

    expect(screen.getByText("Result")).toBeInTheDocument();
  });

  test("通常時はQuizContentが表示される", () => {
    renderWithStore(<QuizPage />, {
      ...commonOption,
      preloadedState: {
        ...commonOption.preloadedState,
        quizContent: {
          ...commonOption.preloadedState.quizContent,
          isLoading: false,
          fetchError: null,
        },
        quizProgress: {
          ...commonOption.preloadedState.quizProgress,
          currentIndex: 2,
        },
      },
    });
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
