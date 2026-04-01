//src/models/errors/quizHistory/quizHistoryMessages.js

import { QUIZ_HISTORY_ERROR_CODE } from "./quizHistoryErrorCode";

export const QUIZ_HISTORY_ERROR_MAP = {
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
