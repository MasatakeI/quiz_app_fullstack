// src/test/models/errors/quizHistory/QuizHistoryError.js
import { describe, test, expect } from "vitest";

import { QuizHistoryError } from "@/models/errors/quizHistory/QuizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "@/models/errors/quizHistory/quizHistoryErrorCode";
import { ModelError } from "@/models/errors/ModelError";

describe("QuizHistoryError", () => {
  test("不明なcodeの場合 UNKNOWNに フォールバックする", () => {
    const error = new QuizHistoryError({
      code: "@@@",
      message: "不正なcode",
    });

    expect(error.code).toBe(QUIZ_HISTORY_ERROR_CODE.UNKNOWN);
    expect(error.message).toBe("不正なcode");
  });

  test("messageを省略した場合 codeがmessageになる", () => {
    const error = new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.VALIDATION,
    });

    expect(error.code).toBe(QUIZ_HISTORY_ERROR_CODE.VALIDATION);
    expect(error.message).toBe(QUIZ_HISTORY_ERROR_CODE.VALIDATION);
  });

  test("正しい継承関係と追加プロパティを保持する", () => {
    const error = new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.VALIDATION,
      message: "バリデーション",
      field: "score",
    });

    expect(error).toBeInstanceOf(QuizHistoryError);
    expect(error).toBeInstanceOf(ModelError);

    expect(error.field).toBe("score");
    expect(error.name).toBe("QuizHistoryError");
  });

  test("cause が正しく 親クラスに渡される", () => {
    const originalError = new Error("Firebase error");

    const error = new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.EXTERNAL,
      cause: originalError,
    });

    expect(error.cause).toBe(originalError);
  });
});
