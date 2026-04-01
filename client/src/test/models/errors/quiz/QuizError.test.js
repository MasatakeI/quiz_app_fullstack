import { describe, test, expect } from "vitest";

import { QuizError } from "@/models/errors/quiz/QuizError";
import { QUIZ_ERROR_CODE } from "@/models/errors/quiz/quizErrorCode";
import { ModelError } from "@/models/errors/ModelError";

describe("QuizError", () => {
  test("不正なcodeの場合 UNKNOWNにフォールバックする", () => {
    const error = new QuizError({
      code: "@@@",
      message: "不正なcode",
    });

    expect(error.code).toBe(QUIZ_ERROR_CODE.UNKNOWN);
    expect(error.message).toBe("不正なcode");
  });

  test("messageを省力した場合 codeがmessageになる", () => {
    const error = new QuizError({
      code: QUIZ_ERROR_CODE.VALIDATION,
    });

    expect(error.code).toBe(QUIZ_ERROR_CODE.VALIDATION);
    expect(error.message).toBe(QUIZ_ERROR_CODE.VALIDATION);
  });

  test("正しい継承関係と追加プロパティ(field)を保持する", () => {
    const error = new QuizError({
      code: QUIZ_ERROR_CODE.VALIDATION,
      message: "バリデーション",
      field: "email",
    });

    expect(error).toBeInstanceOf(QuizError);
    expect(error).toBeInstanceOf(ModelError);

    expect(error.field).toBe("email");
    expect(error.name).toBe("QuizError");
  });

  test("cause (原因) が正しく親クラスに渡される", () => {
    const originalError = new Error("Firebase error");

    const error = new QuizError({
      code: QUIZ_ERROR_CODE.EXTERNAL,
      cause: originalError,
    });

    expect(error.cause).toBe(originalError);
  });
});
