import { Validate } from '@mp4-to-gif/common/validate';
import { DocumentOutEntity } from '../entity';

export class DocumentOutCreateResponseDTO {
  private static validation = Validate.compile(
    DocumentOutCreateResponseDTO.validationSchema(),
    DocumentOutEntity
  );

  constructor(readonly data: DocumentOutCreateResponseDTORaw) {}

  toJSON() {
    return this.data.documentOut.value;
  }

  private static validationSchema() {
    return {
      type: 'object',
      required: ['documentOut'],
      properties: {
        documentOut: {
          instanceof: DocumentOutEntity.name,
        },
      },
    };
  }
}

export interface DocumentOutCreateResponseDTORaw {
  documentOut: DocumentOutEntity;
}
