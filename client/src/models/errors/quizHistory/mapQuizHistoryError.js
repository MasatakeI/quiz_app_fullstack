// client/src/models/errors/quizHistory/mapQuizHistoryError.js

import { QuizHistoryError } from "./QuizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "./quizHistoryErrorCode";
import { QUIZ_HISTORY_ERROR_MAP } from "./quizHistoryMessages";

export const mapQuizHistoryError = (error) => {
  if (error instanceof QuizHistoryError) return error;

  const key = error?.response?.status || error?.code;
  const mapped = QUIZ_HISTORY_ERROR_MAP[key];

  if (mapped) {
    return new QuizHistoryError({
      code: mapped.code,
      message: mapped.message,
      cause: error,
    });
  }

  if (error?.isAxiosError && !error.response) {
    return new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.NETWORK,
      message: "サーバーと通信できません。接続を確認してください",
      cause: error,
    });
  }

  return new QuizHistoryError({
    code: QUIZ_HISTORY_ERROR_CODE.UNKNOWN,
    message: "予期せぬエラーが発生しました",
    cause: error,
  });
};
