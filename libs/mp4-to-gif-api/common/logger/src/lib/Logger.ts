import { hrtime } from 'process';
import { v4 as uuid } from 'uuid';
import { Validate } from '@common/validate';
import { RequestContext } from '@mp4-to-gif-api/common/context';
import { Injectable } from '@mp4-to-gif-api/common/injector';
import { Context, Params } from './interface';
import { ConsoleLoggerTransport, LoggerTransport } from './transport';

@Injectable()
export class Logger {
  private static configValidation = Validate.compile(
    Logger.configValidationSchema()
  );

  private config!: Config;
  private loggerTransports: LoggerTransport[] = [];

  async init(config: Config) {
    this.config = Validate.validate(Logger.configValidation, config);

    this.loggerTransports.push(this.createConsoleLogger());
  }

  debug(message: string, params: Params = {}): string {
    const context = this.context;

    this.loggerTransports.forEach((_) => _.debug(message, context, params));

    return context.messageId;
  }

  info(message: string, params: Params = {}): string {
    const context = this.context;

    this.loggerTransports.forEach((_) => _.info(message, context, params));

    return context.messageId;
  }

  warn(message: string, params: Params = {}): string {
    const context = this.context;

    this.loggerTransports.forEach((_) => _.warn(message, context, params));

    return context.messageId;
  }

  error(message: string, params: Params = {}): string {
    const context = this.context;

    this.loggerTransports.forEach((_) => _.error(message, context, params));

    return context.messageId;
  }

  async flush() {
    for (const lt of this.loggerTransports) {
      await lt.flush();
    }
  }

  private get context(): Context {
    const env = this.config.env;
    const messageId = uuid();
    const requestId = RequestContext.maybeContext();
    const sequenceId = this.sequenceId;
    const pid = process.pid;

    return {
      env,
      messageId,
      requestId,
      sequenceId,
      pid,
    };
  }

  private get sequenceId() {
    const NS_PER_SEC = 1e9;
    const time = hrtime();

    return time[0] * NS_PER_SEC + time[1];
  }

  private createConsoleLogger() {
    const ct = new ConsoleLoggerTransport();

    return ct.init({
      level: this.config.level,
    });
  }

  private static configValidationSchema() {
    return {
      type: 'object',
      required: ['env', 'level'],
      properties: {
        env: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        level: {
          type: 'string',
          enum: ['error', 'warn', 'debug', 'info'],
        },
      },
      additionalProperties: false,
    };
  }
}

interface Config {
  env: string;
  level: string;
}
