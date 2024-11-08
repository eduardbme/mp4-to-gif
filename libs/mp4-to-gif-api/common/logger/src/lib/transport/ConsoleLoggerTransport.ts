import pino from 'pino';
import { Validate } from '@common/validate';
import { Context, Params } from '../interface';
import { LoggerTransport } from './LoggerTransport';

export class ConsoleLoggerTransport extends LoggerTransport {
  private static configValidation = Validate.compile(
    ConsoleLoggerTransport.configValidationSchema()
  );

  private config!: Config;
  private logger!: pino.Logger;

  init(config: Config) {
    this.config = Validate.validate(
      ConsoleLoggerTransport.configValidation,
      config
    );

    this.logger = pino({
      level: this.config.level,
      base: void 0,
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label: string) => {
          return { level: label };
        },
      },
      serializers: {
        error: pino.stdSerializers.errWithCause,
      },
    });

    return this;
  }

  debug(message: string, context: Context, params: Params): void {
    this.logger.debug({ ...params, ...context }, message);
  }

  info(message: string, context: Context, params: Params) {
    this.logger.info({ ...params, ...context }, message);
  }

  warn(message: string, context: Context, params: Params) {
    this.logger.warn({ ...params, ...context }, message);
  }

  error(message: string, context: Context, params: Params) {
    this.logger.error({ ...params, ...context }, message);
  }

  async flush() {
    return;
  }

  private static configValidationSchema() {
    return {
      type: 'object',
      required: ['level'],
      properties: {
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
  level: string;
}
