import {
  DocumentOutCreateRequestDTO,
  DocumentOutCreateResponseDTO,
} from '@mp4-to-gif-api/document/domain';

export interface DocumentQueueUseCase {
  documentOutCreate(
    documentOutCreateRequestDTO: DocumentOutCreateRequestDTO
  ): Promise<DocumentOutCreateResponseDTO>;
}
