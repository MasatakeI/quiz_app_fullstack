import { describe, test, expect } from "vitest";

import {
  addHistoryAsync,
  fetchHistoriesAsync,
  deleteHistoryAsync,
  deleteHistoriesAsync,
} from "@/redux/features/quizHistory/quizHistoryThunks";

import quizHistoryReducer, {
  quizHistoryInitialState,
} from "@/redux/features/quizHistory/quizHistorySlice";

import {
  mockNewQuizHistory,
  mockQuizHistories,
} from "@/test/fixtures/historyFixture";
import { QUIZ_HISTORY_ERROR_CODE } from "@/models/errors/quizHistory/quizHistoryErrorCode";

// ヘルパー

const applyPending = (slice, thunk, prev = quizHistoryInitialState) =>
  slice(prev, thunk.pending());

const applyFulfilled = (slice, thunk, payload, prev) =>
  slice(prev, thunk.fulfilled(payload));

const applyRejected = (slice, thunk, payload, prev) =>
  slice(prev, thunk.rejected(null, "requestId", undefined, payload));

describe("quizHistorySlice", () => {
  test("stateの初期値の確認", () => {
    expect(quizHistoryInitialState).toEqual({
      canPost: true,
      isLoading: false,
      isDeleting: false,

      histories: [],
      error: null,
    });
  });

  describe("addHistoryAsync", () => {
    test("正常系:pendingからfulfilledに遷移し historyを追加する", async () => {
      const pending = applyPending(quizHistoryReducer, addHistoryAsync);
      expect(pending).toEqual({
        ...quizHistoryInitialState,
        canPost: false,
      });

      const fulfilled = applyFulfilled(
        quizHistoryReducer,
        addHistoryAsync,
        mockNewQuizHistory,
        pending,
      );

      expect(fulfilled).toEqual({
        ...pending,
        canPost: true,
        histories: [mockNewQuizHistory],
        error: null,
      });
    });
  });

  describe("fetchHistoriesAsync", () => {
    test("正常系:pendingからfulfilledに遷移し histories配列を取得する", async () => {
      const pending = applyPending(quizHistoryReducer, fetchHistoriesAsync);
      expect(pending).toEqual({
        ...quizHistoryInitialState,
        isLoading: true,
      });

      const fulfilled = applyFulfilled(
        quizHistoryReducer,
        fetchHistoriesAsync,
        mockQuizHistories,
        pending,
      );

      expect(fulfilled).toEqual({
        ...pending,
        isLoading: false,
        histories: mockQuizHistories,
        error: null,
      });
    });
  });

  describe("delete系 正常系共通処理", () => {
    test.each([
      {
        title: "deleteHistoryAsync",
        thunk: deleteHistoryAsync,
        payload: mockQuizHistories[0].id,
      },
      {
        title: "deleteHistoriesAsync",
        thunk: deleteHistoriesAsync,
        payload: [mockQuizHistories[0].id, mockQuizHistories[1].id],
      },
    ])("$title", async ({ thunk, payload }) => {
      const stateWithHistories = {
        ...quizHistoryInitialState,
        histories: mockQuizHistories,
      };
      const pending = applyPending(
        quizHistoryReducer,
        thunk,
        stateWithHistories,
      );
      expect(pending).toEqual({
        ...stateWithHistories,
        isDeleting: true,
      });

      const fulfilled = applyFulfilled(
        quizHistoryReducer,
        deleteHistoryAsync,
        payload,
        pending,
      );

      const deleteIds = Array.isArray(payload) ? payload : [payload];
      const expectedHisotries = mockQuizHistories.filter((his) => {
        return !deleteIds.includes(his.id);
      });

      expect(fulfilled).toEqual({
        ...pending,
        isDeleting: false,
        histories: expectedHisotries,
        error: null,
      });
    });
  });

  describe("異常系共通処理", () => {
    test.each([
      { title: "addHistoryAsync", thunk: addHistoryAsync },
      { title: "fetchHistoriesAsync", thunk: fetchHistoriesAsync },
      { title: "deleteHistoryAsync", thunk: deleteHistoryAsync },
      { title: "deleteHistoriesAsync", thunk: deleteHistoriesAsync },
    ])("$title", ({ thunk }) => {
      const prev = {
        ...quizHistoryInitialState,
        histories: mockQuizHistories,
      };
      const pending = applyPending(quizHistoryReducer, thunk, prev);

      const error = {
        code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
        message: "エラー",
      };

      const rejected = applyRejected(quizHistoryReducer, thunk, error, pending);
      expect(rejected).toMatchObject({
        canPost: true,
        isLoading: false,
        isDeleting: false,
        error,
      });
    });
  });
});
