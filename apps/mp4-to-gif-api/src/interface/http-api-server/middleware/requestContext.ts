import express from 'express';
import { RequestContext } from '@mp4-to-gif-api/common/context';

export function requestContext() {
  return function _requestContext(
    _req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) {
    RequestContext.runCallback(() => next());
  };
}
