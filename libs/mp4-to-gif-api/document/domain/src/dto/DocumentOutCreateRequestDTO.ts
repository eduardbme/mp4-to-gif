import { Validate } from '@mp4-to-gif/common/validate';
import { DocumentKey } from '../interface';
import { documentKey } from '../schema';

export class DocumentOutCreateRequestDTO {
  private static validation = Validate.compile(
    DocumentOutCreateRequestDTO.validationSchema()
  );

  constructor(readonly data: DocumentOutCreateRequestDTORaw) {
    Validate.validate(DocumentOutCreateRequestDTO.validation, data);
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

export interface DocumentOutCreateRequestDTORaw {
  documentKey: DocumentKey;
}
