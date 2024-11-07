import assert from 'assert';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

export class RequestContext {
  private static asyncLocalStorage = new AsyncLocalStorage<RequestId>();

  static run$() {
    return <T>(source: Observable<T>): Observable<T> => {
      return new Observable((subscriber) => {
        const subscription = source.subscribe({
          next: (_) => RequestContext.runCallback(() => subscriber.next(_)),
          error: (error) =>
            RequestContext.runCallback(() => subscriber.error(error)),
          complete: () =>
            RequestContext.runCallback(() => subscriber.complete()),
        });

        return () => subscription.unsubscribe();
      });
    };
  }

  static runCallback(cb: (requestId: RequestId) => void) {
    const requestId0 = RequestContext.maybeContext();
    const requestId = requestId0 ? requestId0 : uuid();

    RequestContext.asyncLocalStorage.run(requestId, () => cb(requestId));
  }

  static context() {
    const ctx = RequestContext.asyncLocalStorage.getStore();
    assert(ctx);

    return ctx;
  }

  static maybeContext() {
    return RequestContext.asyncLocalStorage.getStore();
  }
}

type RequestId = string;
