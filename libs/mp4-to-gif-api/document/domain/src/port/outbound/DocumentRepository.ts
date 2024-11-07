import {
  DocumentInCreateCmd,
  DocumentInEntity,
  DocumentSignedUrlGetCmd,
  DocumentSignedUrlVO,
} from '../../';

export interface DocumentRepository {
  documentInCreate(
    documentInCreateCmd: DocumentInCreateCmd
  ): Promise<DocumentInEntity>;
  documentOutCreate(
    documentInCreateCmd: DocumentInCreateCmd
  ): Promise<DocumentInEntity>;
  documentSignedUrlGet(
    documentSignedUrlGetCmd: DocumentSignedUrlGetCmd
  ): Promise<DocumentSignedUrlVO>;
}
