import { describe, test, expect } from "vitest";

import { AuthError } from "@/models/errors/auth/AuthError";
import { AUTH_ERROR_CODE } from "@/models/errors/auth/authErrorCode";
import { ModelError } from "@/models/errors/ModelError";

describe("AuthError", () => {
  test("不正なcodeの場合 UNKNOWNにフォールバックする", () => {
    const error = new AuthError({
      code: "@@@",
      message: "不正なcode",
    });

    expect(error.code).toBe(AUTH_ERROR_CODE.UNKNOWN);
    expect(error.message).toBe("不正なcode");
  });

  test("messageを省力した場合 codeがmessageになる", () => {
    const error = new AuthError({
      code: AUTH_ERROR_CODE.VALIDATION,
    });

    expect(error.code).toBe(AUTH_ERROR_CODE.VALIDATION);
    expect(error.message).toBe(AUTH_ERROR_CODE.VALIDATION);
  });

  test("正しい継承関係と追加プロパティ(field)を保持する", () => {
    const error = new AuthError({
      code: AUTH_ERROR_CODE.VALIDATION,
      message: "バリデーション",
      field: "email",
    });

    expect(error).toBeInstanceOf(AuthError);
    expect(error).toBeInstanceOf(ModelError);

    expect(error.field).toBe("email");
    expect(error.name).toBe("AuthError");
  });

  test("cause (原因) が正しく親クラスに渡される", () => {
    const originalError = new Error("Firebase error");

    const error = new AuthError({
      code: AUTH_ERROR_CODE.EXTERNAL,
      cause: originalError,
    });

    expect(error.cause).toBe(originalError);
  });
});
