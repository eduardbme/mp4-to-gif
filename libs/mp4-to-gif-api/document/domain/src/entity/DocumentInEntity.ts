import { Validate } from '@mp4-to-gif/common/validate';
import { DocumentKey } from '../interface';
import { documentKey } from '../schema';

export class DocumentInEntity {
  private static validation = Validate.compile(
    DocumentInEntity.validationSchema()
  );

  constructor(readonly value: DocumentInEntityRaw) {
    Validate.assert(DocumentInEntity.validation, value);
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

interface DocumentInEntityRaw {
  documentKey: DocumentKey;
}
