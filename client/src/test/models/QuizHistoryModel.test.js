import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  createHistory,
  addHistory,
  fetchHistories,
  performDelete,
} from "@/models/QuizHistoryModel";

import {
  newHistory,
  newHistoryInput,
} from "./__fixtures__/firestoreHistoryData";

import {
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  doc,
  where,
  writeBatch,
} from "firebase/firestore";

import { QuizHistoryError } from "@/models/errors/quizHistory/QuizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "@/models/errors/quizHistory/quizHistoryErrorCode";

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(() => () => "server-timestamp-placeholder"),
  orderBy: vi.fn(),
  doc: vi.fn(),
  where: vi.fn(),
  writeBatch: vi.fn(() => mockBatch),

  getFirestore: vi.fn(),
  collection: vi.fn(),
}));

vi.mock("@/firebase", () => ({
  quizHistoryRef: "mock-collection-ref",
  db: "mock-db",
}));

const mockDocRef = { id: newHistory.id };
const mockSnapshot = {
  exists: () => true,
  id: newHistory.id,
  data: () => ({
    ...newHistoryInput,
    date: newHistory.date,
  }),
};

const mockQuery = {};

const mockBatch = {
  delete: vi.fn().mockReturnThis(),
  commit: vi.fn().mockResolvedValue(),
};

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
  };
};

const mockGetDocSuccess = () => {
  getDoc.mockResolvedValue(mockSnapshot);
};

const mockAddHistorySuccess = () => {
  addDoc.mockResolvedValue(mockDocRef);
  mockGetDocSuccess();
};

describe("QuizHistoryModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createHistory", () => {
    test("正常系:firestoreデータを整形し フォーマットされたクイズ結果情報を返す", () => {
      const result = createHistory(newHistory.id, newHistory);
      expect(result).toEqual(expectHistory(newHistory));
    });

    test("異常系:壊れたデータの場合 QuizHistoryErrorをスローする", () => {
      expect(() =>
        createHistory(newHistory.id, { ...newHistory, score: "@@@" }),
      ).toThrow(
        new QuizHistoryError({
          code: QUIZ_HISTORY_ERROR_CODE.INVALID_DATA,
          message: "無効なデータです",
        }),
      );
    });
  });

  describe("addHistory", () => {
    test("正常系:クイズ結果を保存し 保存した結果を返す", async () => {
      mockAddHistorySuccess();
      const userId = "aaabbb";
      const result = await addHistory(userId, newHistoryInput);

      expect(result).toEqual(expectHistory(newHistory));

      expect(addDoc).toHaveBeenCalledWith(
        "mock-collection-ref",
        expect.objectContaining({
          ...newHistoryInput,
          date: expect.any(Function),
        }),
      );
    });
    describe("異常系:", () => {
      test.each([
        {
          title: "スコアが !number",
          setup: () => {},
          resultData: {},
          code: QUIZ_HISTORY_ERROR_CODE.VALIDATION,
          message: "スコア情報が不足しています",
        },
        {
          title: "追加後データが存在しない",
          setup: () => {
            addDoc.mockResolvedValue(mockDocRef);
            getDoc.mockResolvedValue({ exists: () => false });
          },
          resultData: mockSnapshot.data(),
          code: QUIZ_HISTORY_ERROR_CODE.UNKNOWN,
          message: "クイズ結果の追加に失敗しました",
        },
        {
          title: "addDocが失敗 (通信エラー Firebase SDKエラー)",
          setup: () => {
            const sdkError = new Error("Firebase unavalilable");
            sdkError.code = "unavailable";
            addDoc.mockRejectedValue(sdkError);
          },
          resultData: newHistoryInput,
          code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
          message: "ネットワーク接続がありません",
        },
        {
          title: "getDocが失敗 (通信エラー Firebase SDKエラー)",
          setup: () => {
            addDoc.mockResolvedValue(mockDocRef);
            const sdkError = new Error("Firebase unavalilable");
            sdkError.code = "unavailable";
            getDoc.mockRejectedValue(sdkError);
          },
          resultData: newHistoryInput,
          code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
          message: "ネットワーク接続がありません",
        },
      ])("$title", async ({ setup, resultData, code, message }) => {
        setup?.();
        const userId = "aaabbb";
        await expect(addHistory(userId, resultData)).rejects.toEqual(
          expect.objectContaining({
            code,
            message,
            name: "QuizHistoryError",
          }),
        );
      });
    });
  });

  describe("fetchHistories", () => {
    test("正常系:histories配列を返す", async () => {
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({
        docs: [
          {
            id: newHistory.id,
            data: () => mockSnapshot.data(),
          },
          {
            id: 2,
            data: () => mockSnapshot.data(),
          },
        ],
      });

      const result = await fetchHistories();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expectHistory(newHistory));
      const userId = "aaabbb";
      expect(query).toHaveBeenCalledWith(
        "mock-collection-ref",
        orderBy("date", "desc"),
        where("userId", "==", userId),
      );

      expect(orderBy).toHaveBeenCalledWith("date", "desc");
    });

    test("異常系:データベースに配列が存在しない場合 空配列を返す", async () => {
      query.mockReturnValue(mockQuery);

      getDocs.mockResolvedValue({
        docs: [],
      });
      const userId = "aaabbb";
      const result = await fetchHistories(userId);
      expect(result).toEqual([]);
    });

    test("異常系:getDocsが失敗 (通信エラー Firebase SDKエラー)", async () => {
      query.mockReturnValue(mockQuery);

      const sdkError = new Error("Firebase unavalilable");
      sdkError.code = "unavailable";
      getDocs.mockRejectedValue(sdkError);

      await expect(fetchHistories()).rejects.toEqual(
        expect.objectContaining({
          code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
          message: "ネットワーク接続がありません",
          name: "QuizHistoryError",
        }),
      );
    });
  });

  describe("performDelete", () => {
    test("正常系:指定したidsの historiesを削除し idsを返す", async () => {
      const ids = [1, 2, 3];
      doc.mockReturnValue(mockDocRef);

      const result = await performDelete(ids);
      expect(result).toEqual(ids);

      expect(mockBatch.delete).toHaveBeenCalledTimes(ids.length);
      expect(mockBatch.commit).toHaveBeenCalledTimes(1);

      expect(doc).toHaveBeenCalledTimes(ids.length);
    });

    test("異常系:idsがnull idsのlengthが 0の時 空配列を返す Firestoreを叩かない", async () => {
      const ids = [];
      const result = await performDelete(ids);
      expect(result).toEqual([]);
      expect(writeBatch).not.toHaveBeenCalled();

      const resultNull = await performDelete();
      expect(resultNull).toEqual([]);
    });

    test("異常系: SDKエラーが発生した際、適切にラップして再スローすること", async () => {
      const sdkError = new Error("Firebase unavalilable");
      sdkError.code = "unavailable";
      mockBatch.commit.mockRejectedValue(sdkError);

      await expect(performDelete([1])).rejects.toThrow(QuizHistoryError);

      await expect(performDelete([1])).rejects.toEqual(
        expect.objectContaining({
          code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
          message: "ネットワーク接続がありません",
          name: "QuizHistoryError",
        }),
      );
    });
  });
});
