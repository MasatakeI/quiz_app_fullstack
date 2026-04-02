// client/src/models/errors/quizHistory/quizHistoryErrorCode.ts

export const QUIZ_HISTORY_ERROR_CODE = {
  VALIDATION: "VALIDATION",
  INVALID_DATA: "INVALID_DATA",
  NOT_FOUND: "NOT_FOUND",
  NETWORK: "NETWORK",
  PERMISSION: "PERMISSION",
  UNAUTHORIZED: "UNAUTHORIZED",
  EXTERNAL: "EXTERNAL",
  UNKNOWN: "UNKNOWN",
} as const; // as const をつけることで、読み取り専用の厳格な定数になります

// 型としても使いたい場合は以下を追加
export type QuizHistoryErrorCode =
  (typeof QUIZ_HISTORY_ERROR_CODE)[keyof typeof QUIZ_HISTORY_ERROR_CODE];
