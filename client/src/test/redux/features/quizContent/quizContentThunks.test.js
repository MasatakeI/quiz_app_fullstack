import { describe, test, expect, vi, beforeEach } from "vitest";

import { createQuizzes, validateQuizSettings } from "@/models/QuizModel";
import { fetchQuizzesAsync } from "@/redux/features/quizContent/quizContentThunks";

import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";
import { QuizError } from "@/models/errors/quiz/QuizError";
import { QUIZ_ERROR_CODE } from "@/models/errors/quiz/quizErrorCode";

vi.mock("@/models/QuizModel", () => ({
  createQuizzes: vi.fn(),
  validateQuizSettings: vi.fn(),
}));

const mockQuizList = [
  {
    category: "Sports",
    type: "multiple",
    difficulty: "easy",
    question: "Which country won the FIFA World Cup in 2018?",
    correctAnswer: "France",
    incorrectAnswers: ["Croatia", "Brazil", "Germany"],
  },
];

//ヘルパー関数
const dispatch = vi.fn();
const getState = vi.fn();

const mockSuccess = (fn, value) => fn.mockResolvedValue(value);
// const mockFailure = (fn, error) => fn.mockRejectedValue(error);

const callThunk = async (thunk, params) =>
  thunk(params)(dispatch, getState, undefined);

describe("quizContentThunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getState.mockReturnValue({
      quizContent: { isLoading: false },
    });
  });

  test("成功:取得したquizzesを返す", async () => {
    mockSuccess(createQuizzes, mockQuizList);

    const result = await callThunk(fetchQuizzesAsync, {
      category: mockQuizList[0].category,
      type: mockQuizList[0].type,
      difficulty: mockQuizList[0].difficulty,
      amount: mockQuizList.length,
    });
    expect(result.payload).toEqual(mockQuizList);
    expect(result.type).toBe("quizContent/fetchQuizzes/fulfilled");
    expect(validateQuizSettings).toHaveBeenCalledWith({
      category: mockQuizList[0].category,
      type: mockQuizList[0].type,
      difficulty: mockQuizList[0].difficulty,
      amount: mockQuizList.length,
    });
    expect(createQuizzes).toHaveBeenCalledWith(
      mockQuizList[0].category,
      mockQuizList[0].type,
      mockQuizList[0].difficulty,
      mockQuizList.length,
    );
    expect(dispatch).toHaveBeenCalledWith(
      showSnackbar("クイズの取得に成功しました"),
    );
  });

  test("失敗:createQuizzesが失敗した時, rejected状態になる", async () => {
    createQuizzes.mockRejectedValue(
      new QuizError({
        code: QUIZ_ERROR_CODE.NETWORK,
        message: "ネットワークエラーが発生しました",
      }),
    );

    const result = await callThunk(fetchQuizzesAsync, {
      category: mockQuizList[0].category,
      type: mockQuizList[0].type,
      difficulty: mockQuizList[0].difficulty,
      amount: mockQuizList.length,
    });

    expect(result.type).toBe("quizContent/fetchQuizzes/rejected");
    expect(result.payload).toEqual({
      code: QUIZ_ERROR_CODE.NETWORK,
      message: "ネットワークエラーが発生しました",
      field: undefined,
    });
  });

  test("isLoading=trueの時処理を実行しない", async () => {
    getState.mockReturnValue({
      quizContent: { isLoading: true },
    });

    const result = await callThunk(fetchQuizzesAsync, {
      category: mockQuizList[0].category,
      type: mockQuizList[0].type,
      difficulty: mockQuizList[0].difficulty,
      amount: mockQuizList.length,
    });

    expect(createQuizzes).not.toHaveBeenCalled();
    expect(result.meta.condition).toBe(true);
  });
});
