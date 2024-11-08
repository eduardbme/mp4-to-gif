import assert from 'assert';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';
import { LoggerWithContext } from '../LoggerWithContext';

export class LoggerContext {
  private static asyncLocalStorage = new AsyncLocalStorage<LoggerWithContext>();

  static run$(logger: LoggerWithContext) {
    return <T>(source: Observable<T>): Observable<T> => {
      return new Observable((subscriber) => {
        const subscription = source.subscribe({
          next: (_) =>
            LoggerContext.runCallback(logger, () => subscriber.next(_)),
          error: (error) =>
            LoggerContext.runCallback(logger, () => subscriber.error(error)),
          complete: () =>
            LoggerContext.runCallback(logger, () => subscriber.complete()),
        });

        return () => subscription.unsubscribe();
      });
    };
  }

  static runCallback(
    logger: LoggerWithContext,
    cb: (logger: LoggerWithContext) => void
  ) {
    LoggerContext.asyncLocalStorage.run(logger, () => {
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      cb(LoggerContext.asyncLocalStorage.getStore()!);
    });
  }

  static context() {
    const ctx = LoggerContext.asyncLocalStorage.getStore();
    assert(ctx);

    return ctx;
  }

  static maybeContext() {
    return LoggerContext.asyncLocalStorage.getStore();
  }
}
