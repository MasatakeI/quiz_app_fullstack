import { describe, test, expect, beforeEach, vi } from "vitest";

import { QuizHistoryError } from "@/models/errors/quizHistory/quizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "@/models/errors/quizHistory/quizHistoryErrorCode";
import { mapQuizHistoryError } from "@/models/errors/quizHistory/mapQuizHistoryError";
import { QUIZ_HISTORY_ERROR_MAP } from "@/models/errors/quizHistory/quizHistoryMessages";

describe("mapQuizHistoryError.test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("errorがQuizHistoryErrorの インスタンスの場合 そのまま正規化する", () => {
    const error = new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.VALIDATION,
      message: "エラー",
    });

    const result = mapQuizHistoryError(error);
    expect(result).toBe(error);
  });

  test.each([
    {
      errorCode: "permission-denied",
      key: "permission-denied",

    },
    {
      errorCode: "not-found",
      key: "not-found",
    },
    {
      errorCode: "already-exists",
      key: "already-exists",
    },
    {
      errorCode: "unauthenticated",
      key: "unauthenticated",
    },
    {
      errorCode: "unavailable",
      key: "unavailable",
    },
  ])("エラーコード $errorCode の時", ({ errorCode, key }) => {
    const error = { code: errorCode };

    const result = mapQuizHistoryError(error);

    const expected = QUIZ_HISTORY_ERROR_MAP[key];

    expect(result).toMatchObject({
      code: expected.code,
      message: expected.message,
    });
  });

  test("未知のエラーの場合 Firestoreにフォールバックする", () => {
    const error = { code: "some-new-error" };

    const result = mapQuizHistoryError(error);
    expect(result).toMatchObject({
      code: QUIZ_HISTORY_ERROR_CODE.EXTERNAL,
      message: "データベースエラーが発生しました",
    });
  });

  test("error.codeが存在しない場合 UNKNOWNを返す", () => {
    const error = new Error("@@@");

    const result = mapQuizHistoryError(error);
    expect(result).toMatchObject({
      code: QUIZ_HISTORY_ERROR_CODE.UNKNOWN,
      message: "予期せぬエラーが発生しました",
    });
  });
});
