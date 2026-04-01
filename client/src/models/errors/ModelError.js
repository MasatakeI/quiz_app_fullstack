export class ModelError extends Error {
  constructor({ code, message, cause }) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    if (cause) this.cause = cause;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
