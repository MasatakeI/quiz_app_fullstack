// src/models/errors/QuizError.js

import { QUIZ_ERROR_CODE } from "./quizErrorCode";
import { ModelError } from "../ModelError";

export class QuizError extends ModelError {
  constructor({ code, message, field, cause }) {
    const resolvedCode = Object.values(QUIZ_ERROR_CODE).includes(code)
      ? code
      : QUIZ_ERROR_CODE.UNKNOWN;

    super({
      code: resolvedCode,
      message: message || resolvedCode,
      cause,
    });

    this.field = field;
  }
}
