//src/models/errors/quizHistory/mapQuizHistoryError.js

import { QuizHistoryError } from "./QuizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "./quizHistoryErrorCode";
import { QUIZ_HISTORY_ERROR_MAP } from "./quizHistoryMessages";

export const mapQuizHistoryError = (error) => {
  if (error instanceof QuizHistoryError) return error;

  if (error?.code) {
    const mapped = QUIZ_HISTORY_ERROR_MAP[error.code];

    if (mapped) {
      return new QuizHistoryError({
        code: mapped.code,
        message: mapped.message,
        cause: error,
      });
    }

    return new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.EXTERNAL,
      message: "データベースエラーが発生しました",
    });
  }

  return new QuizHistoryError({
    code: QUIZ_HISTORY_ERROR_CODE.UNKNOWN,
    message: "予期せぬエラーが発生しました",
    cause: error,
  });
};
