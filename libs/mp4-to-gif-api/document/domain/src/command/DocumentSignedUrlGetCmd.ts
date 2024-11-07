import { Validate } from '@mp4-to-gif/common/validate';
import { DocumentKey } from '../interface';
import { documentKey } from '../schema';

export class DocumentSignedUrlGetCmd {
  private static validation = Validate.compile(
    DocumentSignedUrlGetCmd.validationSchema()
  );

  constructor(readonly value: DocumentSignedUrlRaw) {
    Validate.assert(DocumentSignedUrlGetCmd.validation, value);
  }

  private static validationSchema() {
    return {
      type: 'object',
      required: ['documentKey'],
      properties: {
        documentKey,
      },
    };
  }
}

interface DocumentSignedUrlRaw {
  documentKey: DocumentKey;
}
