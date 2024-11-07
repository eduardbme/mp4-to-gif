import { EventEmitter } from 'events';

export class LoggerWithContext extends EventEmitter {
  readonly context: string[];

  constructor(private readonly logger: Logger, context: string | string[]) {
    super();

    this.context = Array.isArray(context) ? context : [context];
  }

  create(context: string | string[]): LoggerWithContext {
    return new LoggerWithContext(
      this.logger,
      [this.context, Array.isArray(context) ? context : [context]].flat()
    );
  }

  debug(message: string, params: Params = {}) {
    const ctx = this.context.map((_) => `[${_}]`).join('');

    return this.logger.debug(`${ctx}: ${message}`, params);
  }

  info(message: string, params: Params = {}) {
    const ctx = this.context.map((_) => `[${_}]`).join('');

    return this.logger.info(`${ctx}: ${message}`, params);
  }

  warn(message: string, params: Params = {}) {
    const ctx = this.context.map((_) => `[${_}]`).join('');

    return this.logger.warn(`${ctx}: ${message}`, params);
  }

  error(message: string, params: Params = {}) {
    const ctx = this.context.map((_) => `[${_}]`).join('');

    return this.logger.error(`${ctx}: ${message}`, params);
  }
}

interface Logger {
  debug(message: string, params: Params): string;
  info(message: string, params: Params): string;
  warn(message: string, params: Params): string;
  error(message: string, params: Params): string;
}

interface Params {
  [k: string]: unknown;
  error?: null | Error;
}
