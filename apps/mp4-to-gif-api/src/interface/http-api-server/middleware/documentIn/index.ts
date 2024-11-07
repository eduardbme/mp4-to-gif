import express from 'express';
import multer, { MulterError } from 'multer';
import { LoggerContext } from '@mp4-to-gif-api/common/logger';
import { DocumentInStorage } from './DocumentInStorage';

export function documentIn() {
  return async function _documentIn(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const logger = LoggerContext.context();

    try {
      await new Promise<void>((resolve, reject) => {
        multer({
          storage: new DocumentInStorage(),
          limits: { fileSize: 2 * 1024 * 1024 * 1024, files: 1 },
        }).single('file')(req, res, (error) => {
          if (error) {
            return reject(error);
          }

          return resolve();
        });
      });

      next();
    } catch (error) {
      if (error instanceof MulterError) {
        return res.status(400).json({
          code: 1422,
          message: `Uploading error: ${error.message}`,
        });
      }

      const errorId = logger.error(`Internal error: ${error.message}.`, error);
      return res
        .status(400)
        .json({ code: 1500, message: 'Internal error', errorId });
    }
  };
}
