import express from 'express';
import {
  LoggerContext,
  LoggerWithContext,
} from '@mp4-to-gif-api/common/logger';

export function loggerContext(logger: LoggerWithContext) {
  return function _loggerContext(
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) {
    LoggerContext.runCallback(logger.create(`${req.method} ${req.path}`), () =>
      next()
    );
  };
}
