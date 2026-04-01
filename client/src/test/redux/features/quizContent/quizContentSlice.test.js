import { describe, test, expect, vi, beforeEach } from "vitest";

import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";

import { fetchQuizzesAsync } from "@/redux/features/quizContent/quizContentThunks";

import { decodedQuizList } from "../../../fixtures/quizFixture";

vi.mock("@/models/QuizModel", () => ({
  createQuizzes: vi.fn(),
}));

const applyPending = (slice, thunk, prev = contentInitialState) =>
  slice(prev, thunk.pending());
const applyFulfilled = (slice, thunk, payload, prev) =>
  slice(prev, thunk.fulfilled(payload));

const applyRejectedWithError = (slice, thunk, error, prev) =>
  slice(prev, thunk.rejected(null, "requestId", undefined, error));

describe("quizContentSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchQuizzesAsync", () => {
    const pending = applyPending(quizContentReducer, fetchQuizzesAsync);
    test("成功:pendingからfulfilledに遷移しquizzesを更新する", () => {
      const fulfilled = applyFulfilled(
        quizContentReducer,
        fetchQuizzesAsync,
        decodedQuizList,
        pending,
      );

      expect(fulfilled).toEqual({
        isLoading: false,
        quizzes: decodedQuizList,
        fetchError: null,
      });
    });

    test("失敗:pendingからrejectedに遷移しfetchErrorを更新する", () => {
      const rejected = applyRejectedWithError(
        quizContentReducer,
        fetchQuizzesAsync,
        "fetch失敗(Thunk)",
        pending,
      );

      expect(rejected).toEqual({
        isLoading: false,
        quizzes: [],
        fetchError: "fetch失敗(Thunk)",
      });
    });
  });
});
