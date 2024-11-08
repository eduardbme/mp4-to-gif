import {
  DocumentInCreateCmd,
  DocumentInEntity,
  DocumentOutCreate2Cmd,
  DocumentSignedUrlGetCmd,
  DocumentSignedUrlVO,
} from '../../';

export interface DocumentRepository {
  documentInCreate(
    documentInCreateCmd: DocumentInCreateCmd
  ): Promise<DocumentInEntity>;
  documentOutCreate(
    documentOutCreateCmd: DocumentOutCreate2Cmd
  ): Promise<DocumentInEntity>;
  documentSignedUrlGet(
    documentSignedUrlGetCmd: DocumentSignedUrlGetCmd
  ): Promise<DocumentSignedUrlVO>;
}
