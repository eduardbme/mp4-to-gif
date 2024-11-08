import { Validate } from '@common/validate';
import { documentKey, DocumentKey } from '@mp4-to-gif/document/domain';

export class DocumentOutCreateResponseDTO {
  private static validation = Validate.compile(
    DocumentOutCreateResponseDTO.validationSchema(),
    File
  );

  constructor(readonly data: DocumentOutCreateResponseDTORaw) {
    Validate.assert(DocumentOutCreateResponseDTO.validation, data);
  }

  private static validationSchema() {
    return {
      type: 'object',
      required: ['documentKey'],
      properties: {
        documentKey,
      },
      additionalProperties: false,
    };
  }
}

export interface DocumentOutCreateResponseDTORaw {
  documentKey: DocumentKey;
}
