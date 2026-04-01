// src/models/errors/mapAuthError.js

import { AuthError } from "./AuthError";
import { AUTH_ERROR_CODE } from "./authErrorCode";
import { AUTH_ERROR_MAP } from "./authMessages";

export const mapAuthError = (error) => {
  if (error instanceof AuthError) {
    return error;
  }

  if (error?.code?.startsWith("auth/")) {
    const mapped = AUTH_ERROR_MAP[error.code];

    if (mapped) {
      return new AuthError({
        code: mapped.code,
        message: mapped.message,
        cause: error,
      });
    }

    return new AuthError({
      code: AUTH_ERROR_CODE.EXTERNAL,
      message: "認証エラーが発生しました",
      cause: error,
    });
  }

  return new AuthError({
    code: AUTH_ERROR_CODE.UNKNOWN,
    message: "予期せぬエラーが発生しました",
    cause: error,
  });
};
