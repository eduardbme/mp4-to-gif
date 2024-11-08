export class ExtendableError extends Error {
  public constructor(message: string, cause?: Error) {
    super(message);

    this.name = this.constructor.name;

    if (
      'captureStackTrace' in Error &&
      typeof Error.captureStackTrace === 'function'
    ) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }

    if (cause && cause.stack) {
      this.stack = `${this.stack}\n\nCause: ${cause.stack}`;
    }
  }
}
