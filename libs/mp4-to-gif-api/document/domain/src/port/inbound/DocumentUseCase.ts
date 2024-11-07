import {
  DocumentInCreateCmd,
  DocumentInEntity,
  DocumentOutCreate1Cmd,
  DocumentOutEntity,
} from '../../';

export interface DocumentUseCase {
  documentOutCreate(
    documentOutConvertCmd: DocumentOutCreate1Cmd
  ): Promise<DocumentOutEntity>;
  documentInCreate(
    uploadDocumentCreateCmd: DocumentInCreateCmd
  ): Promise<DocumentInEntity>;
}
