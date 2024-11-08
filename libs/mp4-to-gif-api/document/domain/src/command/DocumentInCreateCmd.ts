import { Validate } from '@common/validate';
import { DocumentInMimetype, DocumentInReadableStream } from '../interface';
import { documentInMimetype, documentStream } from '../schema';

export class DocumentInCreateCmd {
  private static validation = Validate.compile(
    DocumentInCreateCmd.validationSchema()
  );

  constructor(readonly value: DocumentInCreateCmdRaw) {
    Validate.assert(DocumentInCreateCmd.validation, value);
  }

  private static validationSchema() {
    return {
      type: 'object',
      required: ['documentStream', 'documentMimetype'],
      properties: {
        documentStream,
        documentMimetype: documentInMimetype,
      },
    };
  }
}

interface DocumentInCreateCmdRaw {
  documentStream: DocumentInReadableStream;
  documentMimetype: DocumentInMimetype;
}
