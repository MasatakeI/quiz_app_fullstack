import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  createHistory,
  addHistory,
  fetchHistories,
  performDelete,
} from "@/models/QuizHistoryModel";

import * as QuizHistoryFetcher from "@/data_fetcher/QuizHistoryFetcher";

vi.mock("@/data_fetcher/QuizHistoryFetcher");

import { newHistory } from "./__fixtures__/firestoreHistoryData";

import { QuizHistoryError } from "@/models/errors/quizHistory/QuizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "@/models/errors/quizHistory/quizHistoryErrorCode";

// ヘルパー
const expectHistory = (history) => {
  return {
    id: history.id,
    category: history.category,
    date: history.expectedDate,
    difficulty: history.difficulty,
    score: history.score,
    totalQuestions: history.totalQuestions,
    accuracy: history.accuracy,
    type: history.type,
  };
};

describe("QuizHistoryModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-01T22:00:00"));
  });

  describe("createHistory", () => {
    test("正常系:Fetcher経由で保存し,モデル化した結果を返す", () => {
      const result = createHistory(newHistory.id, newHistory);
      expect(result).toEqual(expectHistory(newHistory));
    });

    test("異常系:壊れたデータの場合 QuizHistoryErrorをスローする", () => {
      expect(() =>
        createHistory(newHistory.id, { ...newHistory, score: true }),
      ).toThrow(
        new QuizHistoryError({
          code: QUIZ_HISTORY_ERROR_CODE.INVALID_DATA,
          message: "サーバーから受け取ったデータが不正です",
        }),
      );
    });

    test("正常系:スコアが 0 の場合、accuracy が 0 になること", () => {
      const result = createHistory("id-0", {
        ...newHistory,
        score: 0,
        totalQuestions: 10,
      });
      expect(result.accuracy).toBe(0);
    });
  });

  describe("addHistory", () => {
    test("正常系:クイズ結果を保存し 保存した結果を返す", async () => {
      const mockResponse = {
        id: "12345",
        category: "Science",
        score: 8,
        totalQuestions: 10,
        difficulty: "medium",
        type: "multiple",
        date: "2024-06-01T12:00:00",
      };
      QuizHistoryFetcher.postQuizHistory.mockResolvedValue(mockResponse);
      const result = await addHistory("aaa", mockResponse);

      expect(result).toEqual({
        id: mockResponse.id,
        category: mockResponse.category,
        score: mockResponse.score,
        totalQuestions: mockResponse.totalQuestions,
        difficulty: mockResponse.difficulty,
        type: mockResponse.type,
        date: "2024/06/01 12:00",
        accuracy: 0.8,
      });

      expect(QuizHistoryFetcher.postQuizHistory).toHaveBeenCalledWith(
        "aaa",
        mockResponse,
      );
    });
  });

  describe("fetchHistories", () => {
    test("正常系:histories配列を返す", async () => {
      const userId = "aaabbb";
      const mockData = [
        {
          id: "12345",
          category: "Science",
          score: 8,
          totalQuestions: 10,
          difficulty: "medium",
          type: "multiple",

          date: "2024-06-01T12:00:00",
        },
        {
          id: "67890",
          category: "History",
          score: 5,
          totalQuestions: 10,
          difficulty: "easy",
          type: "boolean",
          date: "2024-05-01T15:30:00",
        },
      ];
      QuizHistoryFetcher.fetchQuizHistory.mockResolvedValue(mockData);
      const result = await fetchHistories(userId);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        accuracy: 0.8,
        category: "Science",
        date: "2024/06/01 12:00",
        difficulty: "medium",
        id: "12345",
        score: 8,
        totalQuestions: 10,
        type: "multiple",
      });

      expect(QuizHistoryFetcher.fetchQuizHistory).toHaveBeenCalledWith(userId);
    });

    test("異常系:データベースにデータがない場合 空配列を返す", async () => {
      const userId = "aaabbb";
      const mockData = [];
      QuizHistoryFetcher.fetchQuizHistory.mockResolvedValue(mockData);
      const result = await fetchHistories(userId);
      expect(result).toHaveLength([]);
    });

    test("異常系:fetchHistoriesが失敗した時 マッパーを通じてエラーを再スローする", async () => {
      const userId = "aaabbb";

      const mockError = new Error("Firebase Unavailable");

      QuizHistoryFetcher.fetchQuizHistory.mockRejectedValue(mockError);

      await expect(fetchHistories(userId)).rejects.toMatchObject({
        code: QUIZ_HISTORY_ERROR_CODE.UNKNOWN, // 受信した事実に合わせる
        name: "QuizHistoryError",
      });
    });
  });

  describe("performDelete", () => {
    test("正常系:指定したidsの historiesを削除し idsを返す", async () => {
      const ids = [1, 2, 3];
      QuizHistoryFetcher.deleteQuizHistories.mockResolvedValue({ ids });
      const result = await performDelete(ids);
      expect(result).toEqual(ids);

      expect(QuizHistoryFetcher.deleteQuizHistories).toHaveBeenCalledWith(ids);
    });

    test("異常系:idsがnull idsのlengthが 0の時 空配列を返す Firestoreを叩かない", async () => {
      const ids = [];
      const result = await performDelete(ids);
      expect(result).toEqual([]);
      expect(QuizHistoryFetcher.deleteQuizHistories).not.toHaveBeenCalled();
      const resultNull = await performDelete();
      expect(resultNull).toEqual([]);
      expect(QuizHistoryFetcher.deleteQuizHistories).not.toHaveBeenCalled();
    });

    test("異常系:performDeleteが失敗した時 マッパーを通じてエラーを再スローする", async () => {
      const ids = ["1", "2"];
      const mockError = new Error("Delete Failed");
      QuizHistoryFetcher.deleteQuizHistories.mockRejectedValue(mockError);

      await expect(performDelete(ids)).rejects.toMatchObject({
        code: QUIZ_HISTORY_ERROR_CODE.UNKNOWN,
        name: "QuizHistoryError",
      });
    });
  });
});
