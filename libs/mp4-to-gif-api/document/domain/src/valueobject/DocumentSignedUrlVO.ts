import { Validate } from '@common/validate';
import {
  DocumentKey,
  DocumentSignedUrl as DocumentSignedUrl0,
} from '../interface';
import { documentKey, documentSignedUrl } from '../schema';

export class DocumentSignedUrlVO {
  private static validation = Validate.compile(
    DocumentSignedUrlVO.validationSchema()
  );

  constructor(readonly value: DocumentSignedUrlRaw) {
    Validate.assert(DocumentSignedUrlVO.validation, value);
  }

  private static validationSchema() {
    return {
      type: 'object',
      required: ['documentKey', 'documentSignedUrl'],
      properties: {
        documentKey,
        documentSignedUrl,
      },
    };
  }
}

interface DocumentSignedUrlRaw {
  documentKey: DocumentKey;
  documentSignedUrl: DocumentSignedUrl0;
}
