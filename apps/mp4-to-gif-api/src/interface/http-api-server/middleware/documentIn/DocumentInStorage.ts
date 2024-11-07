import { Request } from 'express';
import { injector } from '@mp4-to-gif-api/common/injector';
import { DocumentService } from '@mp4-to-gif-api/document/adapter';
import { DocumentInCreateCmd } from '@mp4-to-gif-api/document/domain';

export class DocumentInStorage {
  private readonly documentService: DocumentService;

  constructor() {
    this.documentService = injector.get(DocumentService);
  }

  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: null | Error, info?: Partial<Express.Multer.File>) => void
  ) {
    try {
      const uploadDocument = await this.documentService.documentInCreate(
        new DocumentInCreateCmd({
          documentStream: file.stream,
          documentMimetype: file.mimetype,
        })
      );
      const { documentKey } = uploadDocument.value;

      callback(null, { ...file, path: documentKey });
    } catch (error) {
      callback(error);
    }
  }

  _removeFile(
    _req: Request,
    _file: Express.Multer.File,
    callback: (error: null | Error) => void
  ) {
    // Skip this implementation
    // Remove logic relies on the async cleanup process
    callback(null);
  }
}
