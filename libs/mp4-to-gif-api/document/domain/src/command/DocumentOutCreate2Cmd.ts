import { Validate } from '@mp4-to-gif/common/validate';
import { DocumentMimetype, DocumentReadableStream } from '../interface';
import { documentMimetype, documentStream } from '../schema';

export class DocumentOutCreate2Cmd {
  private static validation = Validate.compile(
    DocumentOutCreate2Cmd.validationSchema()
  );

  constructor(readonly value: DocumentOutCreate2Raw) {
    Validate.assert(DocumentOutCreate2Cmd.validation, value);
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

interface DocumentOutCreate2Raw {
  documentStream: DocumentReadableStream;
  documentMimetype: DocumentMimetype;
}
