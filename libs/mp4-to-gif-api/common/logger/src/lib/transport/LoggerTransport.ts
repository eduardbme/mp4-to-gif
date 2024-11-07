import { Context, Params } from '../interface';

export abstract class LoggerTransport {
  protected levels = ['debug', 'info', 'warn', 'error'];
  abstract debug(message: string, context: Context, params: Params): void;
  abstract info(message: string, context: Context, params: Params): void;
  abstract warn(message: string, context: Context, params: Params): void;
  abstract error(message: string, context: Context, params: Params): void;
  abstract flush(): Promise<void>;
}
