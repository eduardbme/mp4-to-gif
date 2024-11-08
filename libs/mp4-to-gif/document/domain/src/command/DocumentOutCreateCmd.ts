import { Validate } from '@common/validate';
import { DocumentInFile } from '../interface';
import { documentInFile } from '../schema';

export class DocumentOutCreateCmd {
  private static validation = Validate.compile(
    DocumentOutCreateCmd.validationSchema(),
    File
  );

  constructor(readonly data: DocumentOutCreateCmdRaw) {
    Validate.assert(DocumentOutCreateCmd.validation, data);
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

interface DocumentOutCreateCmdRaw {
  documentInFile: DocumentInFile;
}
