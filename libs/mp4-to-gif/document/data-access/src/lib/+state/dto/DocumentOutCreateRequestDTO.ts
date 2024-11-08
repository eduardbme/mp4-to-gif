import { Validate } from '@common/validate';
import { documentInFile, DocumentInFile } from '@mp4-to-gif/document/domain';

export class DocumentOutCreateRequestDTO {
  private static validation = Validate.compile(
    DocumentOutCreateRequestDTO.validationSchema(),
    File
  );

  constructor(readonly data: DocumentOutCreateRequestDTORaw) {
    Validate.assert(DocumentOutCreateRequestDTO.validation, data);
  }

  private static validationSchema() {
    return {
      type: 'object',
      required: ['documentInFile'],
      properties: {
        documentInFile,
      },
      additionalProperties: false,
    };
  }
}

interface DocumentOutCreateRequestDTORaw {
  documentInFile: DocumentInFile;
}
