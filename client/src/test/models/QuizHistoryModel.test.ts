// /client/src/test/models/QuizHistoryModel.test.ts
vi.mock("@/data_fetcher/QuizHistoryFetcher", () => ({
  postQuizHistory: vi.fn(),
  fetchQuizHistory: vi.fn(),
  deleteQuizHistories: vi.fn(),
}));
import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  postQuizHistory,
  fetchQuizHistory,
  deleteQuizHistories,
} from "@/data_fetcher/QuizHistoryFetcher";

import {
  createHistory,
  addHistory,
  fetchHistories,
  performDelete,
} from "@/models/QuizHistoryModel";

import {
  newHistory,
  validRawHistoryData,
} from "./__fixtures__/firestoreHistoryData";
import { QuizHistoryError } from "@/models/errors/quizHistory/QuizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "../../models/errors/quizHistory/quizHistoryErrorCode";

// ヘルパー
// const expectHistory = (history: any) => {
//   return {
//     id: history.id,
//     category: history.category,
//     date: history.expectedDate,
//     difficulty: history.difficulty,
//     score: history.score,
//     totalQuestions: history.totalQuestions,
//     accuracy: history.accuracy,
//     type: history.type,
//   };
// };

const localValidData = {
  id: "test-id",
  category: "science",
  date: "2026-04-01T22:00:00",
  difficulty: "medium",
  score: 8,
  totalQuestions: 10,
  type: "multiple",
};

describe("QuizHistoryModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-01T22:00:00"));
  });

  describe("createHistory", () => {
    test("正常系:Fetcher経由で保存し,モデル化した結果を返す", () => {
      // もしここで落ちるなら、validRawHistoryData が undefined です
      // if (!validRawHistoryData) {
      //   throw new Error("validRawHistoryData is not imported correctly");
      // }

      const result = createHistory("test-id", localValidData);

      expect(result.id).toBe("test-id");
      expect(result.accuracy).toBe(0.8);
      expect(result.date).toBe("2026/04/01 22:00");
    });

    test("異常系:壊れたデータの場合 QuizHistoryErrorをスローする", () => {
      expect(() =>
        createHistory(newHistory.id, { ...newHistory, score: "@@@" }),
      ).toThrow(
        // new
        QuizHistoryError,
        // (),
        //   {
        //   code: QUIZ_HISTORY_ERROR_CODE.INVALID_DATA,
        //   message: "サーバーから受け取ったデータが不正です",
        // }
      );
    });

    test("正常系:スコアが 0 の場合、accuracy が 0 になること", () => {
      const result = createHistory("id-0", {
        ...localValidData,
        score: 0,
        totalQuestions: 10,
      });
      expect(result.accuracy).toBe(0);
    });
  });

  describe("addHistory", () => {
    test("正常系: axios層を直接コントロールして ID を固定する", async () => {
      const userId = "12345";
      const mockResponse = {
        id: "12345",
        category: "Science",
        score: 8,
        totalQuestions: 10,
        difficulty: "medium",
        type: "multiple",
        date: "2024-06-01T12:00:00",
      };

      vi.mocked(postQuizHistory).mockResolvedValue(mockResponse);

      const result = await addHistory(userId, mockResponse);

      // これで "12345" にならない場合、addHistory の return 直前で id をランダム生成していることになります
      expect(result.id).toBe("12345");
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
      vi.mocked(fetchQuizHistory).mockResolvedValue(mockData);

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

      expect(fetchQuizHistory).toHaveBeenCalledWith(userId);
    });

    test("異常系:データベースにデータがない場合 空配列を返す", async () => {
      const userId = "aaabbb";
      vi.mocked(fetchQuizHistory).mockResolvedValue([]); // 空配列を返す
      const result = await fetchHistories(userId);
      expect(result).toEqual([]); // 配列そのものを比較するか
      expect(result).toHaveLength(0); // 長さを比較する
    });

    test("異常系:fetchHistoriesが失敗した時 マッパーを通じてエラーを再スローする", async () => {
      const userId = "aaabbb";

      const mockError = new Error("Firebase Unavailable");

      vi.mocked(fetchQuizHistory).mockRejectedValue(mockError);

      await expect(fetchHistories(userId)).rejects.toMatchObject({
        code: QUIZ_HISTORY_ERROR_CODE.UNKNOWN, // 受信した事実に合わせる
        name: "QuizHistoryError",
      });
    });
  });

  describe("performDelete", () => {
    test("正常系:指定したidsの historiesを削除し idsを返す", async () => {
      const ids = ["1", "2", "3"];
      // FetcherのDeleteResponse型 { ids: string[] } に合わせる
      vi.mocked(deleteQuizHistories).mockResolvedValue({ ids });

      const result = await performDelete(ids);

      expect(result).toEqual(ids);
      expect(deleteQuizHistories).toHaveBeenCalledWith(ids);
    });

    test("異常系:idsが空の時 空配列を返し, Fetcherを叩かない", async () => {
      const result = await performDelete([]);
      expect(result).toEqual([]);
      expect(deleteQuizHistories).not.toHaveBeenCalled();
    });

    test("異常系:失敗した時 マッパーを通じてエラーを再スローする", async () => {
      const ids = ["1"];
      const mockError = new Error("Delete Failed");
      vi.mocked(deleteQuizHistories).mockRejectedValue(mockError);

      await expect(performDelete(ids)).rejects.toMatchObject({
        code: QUIZ_HISTORY_ERROR_CODE.UNKNOWN,
        name: "QuizHistoryError",
      });
    });
  });
});
