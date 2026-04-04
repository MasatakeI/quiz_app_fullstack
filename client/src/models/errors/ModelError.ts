export interface ModelErrorParams {
  code: string;
  message: string;
  cause?: unknown;
}

export class ModelError extends Error {
  public readonly code: string;
  public readonly cause?: unknown;
  constructor({ code, message, cause }: ModelErrorParams) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.cause = cause;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
