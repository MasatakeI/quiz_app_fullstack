// src/models/errors/authMessages.js

import { AUTH_ERROR_CODE } from "./authErrorCode";

export const AUTH_MESSAGE = {
  REQUIRED: "メールアドレスとパスワードは必須です",
  PASSWORD_LENGTH: "パスワードは6文字以上です",
  NOT_AUTHENTICATION: "認証されていないメールアドレスのためログインできません",
};

export const AUTH_ERROR_MAP = {
  "auth/email-already-in-use": {
    code: AUTH_ERROR_CODE.VALIDATION,
    message: "このメールアドレスはすでに使用されています",
  },
  "auth/invalid-email": {
    code: AUTH_ERROR_CODE.VALIDATION,
    message: "メールアドレスの形式が正しくありません",
  },
  "auth/user-not-found": {
    code: AUTH_ERROR_CODE.NOT_FOUND,
    message: "ユーザーが存在しません",
  },

  "auth/network-request-failed": {
    code: AUTH_ERROR_CODE.NETWORK,
    message: "ネットワークエラーが発生しました",
  },
};
