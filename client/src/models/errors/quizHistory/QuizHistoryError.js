// src/models/errors/quizHistory/QuizHistoryError.js

import { QUIZ_HISTORY_ERROR_CODE } from "./quizHistoryErrorCode";
import { ModelError } from "../ModelError";

export class QuizHistoryError extends ModelError {
  constructor({ code, message, field, cause }) {
    const resolvedCode = Object.values(QUIZ_HISTORY_ERROR_CODE).includes(code)
      ? code
      : QUIZ_HISTORY_ERROR_CODE.UNKNOWN;

    super({
      code: resolvedCode,
      message: message || resolvedCode,
      cause,
    });

    this.field = field;
  }
}
