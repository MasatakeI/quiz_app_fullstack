// src/models/errors/AuthError.js
import { AUTH_ERROR_CODE } from "./authErrorCode";
import { ModelError } from "../ModelError";

export class AuthError extends ModelError {
  constructor({ code, message, field, cause }) {
    const resolvedCode = Object.values(AUTH_ERROR_CODE).includes(code)
      ? code
      : AUTH_ERROR_CODE.UNKNOWN;

    super({
      code: resolvedCode,
      message: message || resolvedCode,
      cause,
    });

    this.field = field;
  }
}
