import { Validate } from '@common/validate';
import { DocumentKey } from '../interface';
import { documentKey } from '../schema';

export class DocumentOutCreate1Cmd {
  private static validation = Validate.compile(
    DocumentOutCreate1Cmd.validationSchema()
  );

  constructor(readonly value: DocumentOutCreate1CmdRaw) {
    Validate.assert(DocumentOutCreate1Cmd.validation, value);
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

interface DocumentOutCreate1CmdRaw {
  documentKey: DocumentKey;
}
