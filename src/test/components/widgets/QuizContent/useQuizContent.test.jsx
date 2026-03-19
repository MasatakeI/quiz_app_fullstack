// useQuizContent.test.jsx
import { describe, vi, expect, test, beforeEach } from "vitest";
import { act } from "@testing-library/react";

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

import { useQuizContent } from "@/components/widgets/QuizContent/useQuizContent";
import { renderHookWithStore } from "@/test/utils/renderHookWithStore";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,

    useParams: () => ({ category: "sports" }),
  };
});

describe("useQuizContent.js", () => {
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
      quizHistory: { ...quizHistoryInitialState },
      auth: { ...authInitialState },
    },
  };

  describe("selectAnswer", () => {
    test("すでに回答済み(canPost=false)の時 selectAnswerは何もしない", async () => {
      const { result, dispatchSpy } = renderHookWithStore({
        hook: () => useQuizContent(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizContent: {
            quizzes: [
              { correctAnswer: "a", incorrectAnswers: ["b", "c", "d"] },
            ],
          },
        },
      });

      act(() => {
        result.current.selectAnswer("a");
      });

      dispatchSpy.mockClear();

      act(() => {
        result.current.selectAnswer("b");
      });

      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(result.current.quizResult.selected).toBe("a");
    });
    test("selectAnswerを呼ぶとcanPostがfalse,quizResultに値がセットされsubmitAnswerがdispatchされる", () => {
      const { result, dispatchSpy } = renderHookWithStore({
        hook: () => useQuizContent(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizContent: {
            quizzes: [
              { correctAnswer: "a", incorrectAnswers: ["b", "c", "d"] },
            ],
          },
        },
      });

      act(() => {
        result.current.selectAnswer("a");
      });

      expect(result.current.quizResult).toEqual({
        isCorrect: true,
        selected: "a",
        correct: "a",
        message: "正解!",
      });
      expect(result.current.canPost).toBe(false);
      expect(dispatchSpy).toHaveBeenCalled();
    });

    test.each([
      {
        answer: "a",
        targetField: "numberOfCorrects",
      },
      {
        answer: "b",
        targetField: "numberOfIncorrects",
      },
    ])(
      "回答が$answerの時$targetFieldが加算される",
      ({ answer, targetField }) => {
        const { result, store } = renderHookWithStore({
          hook: () => useQuizContent(),
          ...commonOptions,
          preloadedState: {
            ...commonOptions.preloadedState,
            quizContent: {
              quizzes: [
                { correctAnswer: "a", incorrectAnswers: ["b", "c", "d"] },
              ],
            },
          },
        });

        act(() => {
          result.current.selectAnswer(answer);
        });

        const state = store.getState().quizProgress;
        expect(state[targetField]).toBe(1);
      },
    );

    test("currentQuizがnullの時 answers は空配列を返す", async () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizContent(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizContent: {
            quizzes: [],
          },
        },
      });

      expect(result.current.answers).toEqual([]);
    });

    test.each([
      {
        answer: "a",
        expectedMessage: "正解!",
      },
      {
        answer: "b",
        expectedMessage: "不正解...",
      },
    ])("message分岐: $expectedMessage", ({ answer, expectedMessage }) => {
      const { result } = renderHookWithStore({
        hook: () => useQuizContent(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizContent: {
            quizzes: [
              { correctAnswer: "a", incorrectAnswers: ["b", "c", "d"] },
            ],
          },
        },
      });

      act(() => {
        result.current.selectAnswer(answer);
      });

      expect(result.current.quizResult.message).toBe(expectedMessage);
    });
  });

  test("handleNext:currentIndexが1進む,canPostがtrueに戻る,quizResultがnullになる", () => {
    const { result, store } = renderHookWithStore({
      hook: () => useQuizContent(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        quizContent: {
          quizzes: [{ correctAnswer: "a", incorrectAnswers: ["b", "c", "d"] }],
        },
      },
    });

    act(() => {
      result.current.selectAnswer("a");
    });

    expect(result.current.canPost).toBe(false);

    act(() => {
      result.current.handleNext();
    });

    const state = store.getState().quizProgress;
    expect(state.currentIndex).toBe(1);
    expect(result.current.canPost).toBe(true);
    expect(result.current.quizResult).toBe(null);
  });

  test("type=booleanの時選択肢はTrue/Falseに固定される", () => {
    const { result } = renderHookWithStore({
      hook: () => useQuizContent(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        quizContent: {
          quizzes: [{ question: "a" }],
        },
      },
      initialPath: "/quiz/sports?type=boolean",
    });
    expect(result.current.answers).toEqual(["True", "False"]);
  });

  test("type=multipleの時 answers は shuffledAnswers を返す", () => {
    const { result } = renderHookWithStore({
      hook: () => useQuizContent(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        quizContent: {
          quizzes: [
            {
              correctAnswer: "a",
              incorrectAnswers: ["b", "c", "d"],
            },
          ],
        },
      },
      initialPath: "/quiz/sports?type=multiple",
    });

    expect(result.current.answers).toHaveLength(4);
  });

  test("typeがboolean/multiple以外の時 getType は undefined", () => {
    const { result } = renderHookWithStore({
      hook: () => useQuizContent(),
      ...commonOptions,
      initialPath: "/quiz/sports?type=unknown",
    });

    expect(result.current.getType).toBeUndefined();
  });

  test.each([
    {
      path: "/quiz/sports?type=boolean",
      expected: "2択",
    },
    {
      path: "/quiz/sports?type=multiple",
      expected: "4択",
    },
    {
      path: "/quiz/sports?type=unknown",
      expected: undefined,
    },
  ])("getType: $path", ({ path, expected }) => {
    const { result } = renderHookWithStore({
      hook: () => useQuizContent(),
      ...commonOptions,
      initialPath: path,
    });

    expect(result.current.getType).toBe(expected);
  });

  test("amount が URL から取得される", () => {
    const { result } = renderHookWithStore({
      hook: () => useQuizContent(),
      ...commonOptions,
      initialPath: "/quiz/sports?type=boolean&amount=7",
    });

    expect(result.current.amount).toBe("7");
  });

  // 90行目（returnオブジェクト）と内部プロパティの完全網羅
  test("戻り値の全プロパティが正しく評価されることを確認", () => {
    const { result } = renderHookWithStore({
      hook: () => useQuizContent(),
      ...commonOptions,
      initialPath: "/quiz/sports?type=multiple&amount=10",
    });

    // return されている各プロパティを明示的に読み取る
    expect(result.current.title).toBe("スポーツ"); // getQuizTitle の実行
    expect(result.current.indexMap).toEqual(["A", "B", "C", "D"]); // 定数の評価
    expect(result.current.amount).toBe("10"); // URLパラメータの保持
    expect(typeof result.current.handleGoHome).toBe("function"); // 関数の存在

    // typeMap の multiple ルートを明示的に確認
    expect(result.current.getType).toBe("4択");
  });

  // currentQuiz が undefined の場合の answers 分岐 (answers の初期値分岐)
  test("currentQuiz が存在しない場合、answers は空配列を返す", () => {
    const { result } = renderHookWithStore({
      hook: () => useQuizContent(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        quizContent: { quizzes: [] }, // クイズがない状態
      },
    });

    expect(result.current.answers).toEqual([]);
  });
});
