import { describe, test, expect, vi, beforeEach } from "vitest";

import { ModelError } from "@/models/errors/ModelError";

describe("ModelError", () => {
  test("正しいcodeとmessageを保持する", () => {
    const error = new ModelError({
      code: "VALIDATION",
      message: "バリデーション",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ModelError);
    expect(error.name).toBe("ModelError");
    expect(error.code).toBe("VALIDATION");
    expect(error.message).toBe("バリデーション");
  });

  test("cause (原因となったエラー) を正しく保持できる", () => {
    const originalError = new Error("Firebase error");

    const error = new ModelError({
      code: "EXTERNAL",
      message: "外部エラー",
      cause: originalError,
    });

    expect(error.cause).toBe(originalError);
    expect(error.cause.message).toBe("Firebase error");
  });

  test("子クラスで継承した際 nameプロパティが子クラス名になる", () => {
    class ChildError extends ModelError {}

    const error = new ChildError({
      code: "CHILD_ERROR",
      message: "子クラスエラー",
    });

    expect(error.name).toBe("ChildError");
    expect(error).toBeInstanceOf(ModelError);
  });
});
