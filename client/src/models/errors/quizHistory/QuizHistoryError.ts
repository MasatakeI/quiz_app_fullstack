// src/models/errors/quizHistory/QuizHistoryError.ts

import { QUIZ_HISTORY_ERROR_CODE } from "./quizHistoryErrorCode";
import { ModelError } from "../ModelError";

interface QuizHistoryErrorParams {
  code: string;
  message: string;
  field?: string;
  cause?: any;
}

export class QuizHistoryError extends ModelError {
  field?: string;

  constructor({ code, message, field, cause }: QuizHistoryErrorParams) {
    const codes = Object.values(QUIZ_HISTORY_ERROR_CODE) as string[];
    const resolvedCode = codes.includes(code)
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
