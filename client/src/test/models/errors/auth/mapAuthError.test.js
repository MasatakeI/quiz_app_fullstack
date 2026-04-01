// src/models/errors/mapAuthErrorToModelError.js

import { describe, expect, test, vi, beforeEach } from "vitest";

import { AuthError } from "@/models/errors/auth/AuthError";
import { AUTH_ERROR_CODE } from "@/models/errors/auth/authErrorCode";
import { mapAuthError } from "@/models/errors/auth/mapAuthError";

describe("mapAuthErrorToModelError: FirebaseエラーをAuthErrorに正規化する", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("errorがAuthErrorのインスタンスの場合 そのまま正規化する", () => {
    const error = new AuthError({
      code: AUTH_ERROR_CODE.VALIDATION,
      message: "エラー",
    });

    const result = mapAuthError(error);
    expect(result).toBe(error);
  });

  test.each([
    {
      errorCode: "auth/email-already-in-use",
      message: "このメールアドレスはすでに使用されています",
      authCode: AUTH_ERROR_CODE.VALIDATION,
    },
    {
      errorCode: "auth/invalid-email",
      message: "メールアドレスの形式が正しくありません",
      authCode: AUTH_ERROR_CODE.VALIDATION,
    },
    {
      errorCode: "auth/user-not-found",
      message: "ユーザーが存在しません",
      authCode: AUTH_ERROR_CODE.NOT_FOUND,
    },
    {
      errorCode: "auth/network-request-failed",
      message: "ネットワークエラーが発生しました",
      authCode: AUTH_ERROR_CODE.NETWORK,
    },
  ])("$errorCode の時", async ({ errorCode, message, authCode }) => {
    const error = { code: errorCode };
    const result = mapAuthError(error);
    expect(result).toMatchObject({
      code: authCode,
      message,
    });
  });

  test("未知のauthエラーの場合 Firestoreにフォールバックする", () => {
    const error = { code: "auth/some-new-error" };
    const result = mapAuthError(error);
    expect(result).toMatchObject({
      code: AUTH_ERROR_CODE.EXTERNAL,
      message: "認証エラーが発生しました",
    });
  });

  test("error.codeが存在しない場合 UNKNOWNを返す", () => {
    const error = new Error("@@@");

    const result = mapAuthError(error);

    expect(result).toMatchObject({
      code: AUTH_ERROR_CODE.UNKNOWN,
      message: "予期せぬエラーが発生しました",
    });
  });
});
