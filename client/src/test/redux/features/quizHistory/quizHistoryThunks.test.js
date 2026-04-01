import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  addHistoryAsync,
  fetchHistoriesAsync,
  deleteHistoryAsync,
  deleteHistoriesAsync,
} from "@/redux/features/quizHistory/quizHistoryThunks";
import {
  addHistory,
  deleteHistory,
  fetchHistories,
  deleteHistories,
} from "@/models/QuizHistoryModel";

import {
  mockQuizHistories,
  mockNewQuizHistory,
} from "@/test/fixtures/historyFixture";
// import { QuizHistoryError } from "@/models/errors/quizHistory/quizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "@/models/errors/quizHistory/quizHistoryErrorCode";
import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";

vi.mock("@/models/QuizHistoryModel", () => ({
  addHistory: vi.fn(),
  fetchHistories: vi.fn(),
  deleteHistory: vi.fn(),
  deleteHistories: vi.fn(),
}));

//ヘルパー
const dispatch = vi.fn();
const getState = vi.fn();

const callThunk = async (thunk, params) =>
  thunk(params)(dispatch, getState, undefined);

const mockSuccess = (mockFn, value) => mockFn.mockResolvedValue(value);
// const mockError = (mockFn, error) => mockFn.mockRejectedValue(error);

const SUCCESS_CASES = [
  {
    title: "addHistoryAsync",
    condition: { canPost: true },
    authState: { user: { uid: "@@@" } },

    mockFn: addHistory,
    arg: ["@@@", { userId: "@@@", ...mockNewQuizHistory }],
    thunk: addHistoryAsync,
    params: { resultData: mockNewQuizHistory },
    expected: mockNewQuizHistory,
    type: "quizHistory/addHistory/fulfilled",
    snackbarMessage: "クラウドに結果を保存しました",
  },
  {
    title: "fetchHistoriesAsync",
    condition: { isLoading: false },
    authState: { user: { uid: "@@@" } },

    mockFn: fetchHistories,
    arg: "@@@",
    thunk: fetchHistoriesAsync,
    params: undefined,
    expected: mockQuizHistories,
    type: "quizHistory/fetchHistories/fulfilled",
    snackbarMessage: undefined,
  },
  {
    title: "deleteHistoryAsync",
    condition: { isDeleting: false },
    authState: { user: { uid: "@@@" } },
    mockFn: deleteHistory,
    arg: mockQuizHistories[0].id,
    thunk: deleteHistoryAsync,
    params: { id: mockQuizHistories[0].id },
    expected: mockQuizHistories[0].id,
    type: "quizHistory/delete/fulfilled",
    snackbarMessage: "選択したクイズ結果を削除しました",
  },
  {
    title: "deleteHistoriesAsync",
    condition: { isDeleting: false },
    authState: { user: { uid: "@@@" } },
    mockFn: deleteHistories,
    arg: [[mockQuizHistories[0].id, mockQuizHistories[1].id]],
    thunk: deleteHistoriesAsync,
    params: { ids: [mockQuizHistories[0].id, mockQuizHistories[1].id] },
    expected: [mockQuizHistories[0].id, mockQuizHistories[1].id],
    type: "quizHistory/bulkDelete/fulfilled",
    snackbarMessage: `${[mockQuizHistories[0].id, mockQuizHistories[1].id].length}件のクイズ結果を削除しました`,
  },
];

const FAILED_MODEL_FUNCTION_CASE = [
  {
    title: "addHistoryAsync",
    condition: { canPost: true },
    authState: { user: { uid: "@@@" } },
    mockFn: addHistory,
    thunk: addHistoryAsync,
    params: { resultData: mockNewQuizHistory },
    type: "quizHistory/addHistory/rejected",
  },
  {
    title: "fetchHistoriesAsync",
    condition: { isLoading: false },
    authState: { user: { uid: "@@@" } },

    mockFn: fetchHistories,
    thunk: fetchHistoriesAsync,
    params: undefined,
    type: "quizHistory/fetchHistories/rejected",
  },
  {
    title: "deleteHistoryAsync",
    condition: { isDeleting: false },
    mockFn: deleteHistory,
    thunk: deleteHistoryAsync,
    params: { id: mockQuizHistories[0].id },
    type: "quizHistory/delete/rejected",
  },
  {
    title: "deleteHistoriesAsync",
    condition: { isDeleting: false },
    mockFn: deleteHistories,
    thunk: deleteHistoriesAsync,
    params: { ids: [mockQuizHistories[0].id, mockQuizHistories[1].id] },
    type: "quizHistory/bulkDelete/rejected",
  },
];
const FAILED_OPTIONS_CASE = [
  {
    title: "addHistoryAsync",
    mockFn: addHistory,
    thunk: addHistoryAsync,
    params: { resultData: mockNewQuizHistory },
    condition: { canPost: false },
    authState: { user: { uid: "@@@" } },
  },
  {
    title: "addHistoryAsync (ログインしていない場合)",
    mockFn: addHistory,
    thunk: addHistoryAsync,
    params: { resultData: mockNewQuizHistory },
    condition: { canPost: true },
    authState: { user: null },
  },
  {
    title: "fetchHistoriesAsync",
    mockFn: fetchHistories,
    thunk: fetchHistoriesAsync,
    params: undefined,
    condition: { isLoading: true },
    authState: { user: { uid: "@@@" } },
  },
  {
    title: "fetchHistoriesAsync(ログインしていない場合は配列を返す)",
    mockFn: fetchHistories,
    thunk: fetchHistoriesAsync,
    params: undefined,
    condition: { isLoading: false },
    authState: { user: null },
  },
  {
    title: "deleteHistoryAsync",
    mockFn: deleteHistory,
    thunk: deleteHistoryAsync,
    params: { id: mockQuizHistories[0].id },
    condition: { isDeleting: true },
  },
  {
    title: "deleteHistoriesAsync",
    mockFn: deleteHistories,
    thunk: deleteHistoriesAsync,
    params: { ids: [mockQuizHistories[0].id, mockQuizHistories[1].id] },
    condition: { isDeleting: true },
  },
];

describe("quizHistoryThunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("正常系共通処理", () => {
    test.each(SUCCESS_CASES)(
      "$title",
      async ({
        condition,
        authState,
        mockFn,
        arg,
        thunk,
        params,
        expected,
        type,
        snackbarMessage,
      }) => {
        getState.mockReturnValue({
          quizHistory: condition,
          auth: authState,
        });

        mockSuccess(mockFn, expected);
        const result = await callThunk(thunk, params);
        expect(result.payload).toEqual(expected);
        expect(result.type).toBe(type);

        if (arg === undefined) {
          expect(mockFn).toHaveBeenCalledTimes(1);
        } else if (Array.isArray(arg)) {
          expect(mockFn).toHaveBeenCalledWith(...arg);
        } else {
          expect(mockFn).toHaveBeenCalledWith(arg);
        }

        if (snackbarMessage) {
          expect(dispatch).toHaveBeenCalledWith(showSnackbar(snackbarMessage));
        } else {
          expect(dispatch).not.toHaveBeenCalledWith(
            showSnackbar(expect.anything()),
          );
        }
      },
    );
  });

  describe("異常系共通処理:mockFnが失敗したとき rejected状態になる", () => {
    test.each(FAILED_MODEL_FUNCTION_CASE)(
      "$title",
      async ({ condition, mockFn, thunk, params, type, authState }) => {
        getState.mockReturnValue({
          quizHistory: condition,
          auth: authState,
        });

        const error = {
          code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
          message: "ネットワークエラーが発生しました",
        };
        mockFn.mockRejectedValue(error);

        const result = await callThunk(thunk, params);
        expect(result.payload).toMatchObject({
          code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
          message: "ネットワークエラーが発生しました",
          field: undefined,
        });

        expect(result.type).toBe(type);
      },
    );
  });
  describe("異常系共通処理:condition=falseの時 処理を実行しない", () => {
    test.each(FAILED_OPTIONS_CASE)(
      "$title",
      async ({ mockFn, thunk, params, condition, authState }) => {
        getState.mockReturnValue({
          quizHistory: condition,
          auth: authState || { user: { uid: "@@@" } },
        });

        const result = await callThunk(thunk, params);

        if (thunk === fetchHistoriesAsync && authState?.user === null) {
          expect(result.payload).toEqual([]);
          expect(mockFn).not.toHaveBeenCalled();
        } else {
          expect(mockFn).not.toHaveBeenCalled();
          expect(result.meta.condition).toBe(true);
        }
      },
    );
  });
});
