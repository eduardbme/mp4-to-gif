import express from 'express';
import { LoggerContext } from '@mp4-to-gif-api/common/logger';
import { injector } from '@mp4-to-gif-api/common/injector';
import { DocumentQueueApplication } from '@mp4-to-gif-api/document/adapter';
import {
  DocumentOutCreateRequestDTO,
  DocumentQueueTimeoutError,
} from '@mp4-to-gif-api/document/domain';
import { documentIn } from '../../middleware';

export function documents() {
  const router = express.Router();

  const documentQueueApplication = injector.get(DocumentQueueApplication);

  router.post(
    '/',
    documentIn(),
    async (req: express.Request, res: express.Response) => {
      const logger = LoggerContext.context();

      try {
        const documentOutResponseDTO =
          await documentQueueApplication.documentOutCreate(
            new DocumentOutCreateRequestDTO({ documentKey: req.file.path })
          );

        return res
          .status(200)
          .json({ code: 0, payload: documentOutResponseDTO });
      } catch (error) {
        if (error instanceof DocumentQueueTimeoutError) {
          return res.status(400).json({ code: 1408, message: error.message });
        }

        const errorId = logger.error(`Internal error: ${error.message}`, error);
        return res
          .status(400)
          .json({ code: 1500, message: 'Internal error', errorId });
      }
    }
  );

  return router;
}
