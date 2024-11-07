export function exceptionToNull<T>(
  cb: () => T,
  exception: any,
  ...exceptions: Array<any>
): null | T;
export function exceptionToNull<T>(
  cb: () => Promise<T>,
  exception: any,
  ...exceptions: Array<any>
): null | Promise<T>;
export function exceptionToNull<T>(
  cb: () => T | Promise<T>,
  exception: any,
  ...exceptions: Array<any>
): null | T | Promise<null | T> {
  const allException = [exception, ...exceptions];

  try {
    const res = cb();
    if (res instanceof Promise) {
      return res.catch((_) => raiseExceptionOrNull(_, ...allException));
    }

    return res;
  } catch (error) {
    return raiseExceptionOrNull(error, ...allException);
  }
}

function raiseExceptionOrNull(exception: any, ...exceptions: Array<any>): null {
  for (const _ of exceptions) {
    if (exception instanceof _) {
      return null;
    }
  }

  throw exception;
}
