//client/src/models/errors/quizHistory/quizHistoryMessages.ts

import { QUIZ_HISTORY_ERROR_CODE } from "./quizHistoryErrorCode";

export interface QuizHistoryErrorEntry {
  code: string;
  message: string;
}

export const QUIZ_HISTORY_ERROR_MAP: Record<
  string | number,
  QuizHistoryErrorEntry
> = {
  401: {
    code: QUIZ_HISTORY_ERROR_CODE.UNAUTHORIZED,
    message: "セッションが切れました.再度ログインしてください",
  },
  403: {
    code: QUIZ_HISTORY_ERROR_CODE.PERMISSION,
    message: "この操作を行う権限がありません",
  },
  404: {
    code: QUIZ_HISTORY_ERROR_CODE.NOT_FOUND,
    message: "指定されたデータが見つかりませんでした",
  },
  500: {
    code: QUIZ_HISTORY_ERROR_CODE.EXTERNAL,
    message: "サーバー側でエラーが発生しました。時間をおいて再度お試しください",
  },

  // Firebase Firestore のエラーコードマッピング
  "permission-denied": {
    code: QUIZ_HISTORY_ERROR_CODE.PERMISSION,
    message: "アクセス権限がありません",
  },
  unauthenticated: {
    code: QUIZ_HISTORY_ERROR_CODE.PERMISSION,
    message: "認証されていません",
  },
  unavailable: {
    code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
    message: "ネットワーク接続がありません",
  },
  "not-found": {
    code: QUIZ_HISTORY_ERROR_CODE.NOT_FOUND,
    message: "ドキュメントが存在しません",
  },
  "already-exists": {
    code: QUIZ_HISTORY_ERROR_CODE.INVALID_DATA,
    message: "ドキュメントがすでに存在しています",
  },
};
