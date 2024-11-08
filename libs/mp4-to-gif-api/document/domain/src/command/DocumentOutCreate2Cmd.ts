import { Validate } from '@common/validate';
import { DocumentOutMimetype, DocumentOutReadableStream } from '../interface';
import { documentOutMimetype, documentStream } from '../schema';

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
        documentMimetype: documentOutMimetype,
      },
    };
  }
}

interface DocumentOutCreate2Raw {
  documentStream: DocumentOutReadableStream;
  documentMimetype: DocumentOutMimetype;
}
