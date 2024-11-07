import { Validate } from '@mp4-to-gif/common/validate';
import { DocumentMimetype, DocumentReadableStream } from '../interface';
import { documentMimetype, documentStream } from '../schema';

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
        documentMimetype,
      },
    };
  }
}

interface DocumentInCreateCmdRaw {
  documentStream: DocumentReadableStream;
  documentMimetype: DocumentMimetype;
}
