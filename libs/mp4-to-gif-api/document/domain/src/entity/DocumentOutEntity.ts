import { Validate } from '@mp4-to-gif/common/validate';
import { DocumentKey } from '../interface';
import { documentKey } from '../schema';

export class DocumentOutEntity {
  private static validation = Validate.compile(
    DocumentOutEntity.validationSchema()
  );

  constructor(readonly value: DocumentOutEntityRaw) {
    Validate.assert(DocumentOutEntity.validation, value);
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

export interface DocumentOutEntityRaw {
  documentKey: DocumentKey;
}
