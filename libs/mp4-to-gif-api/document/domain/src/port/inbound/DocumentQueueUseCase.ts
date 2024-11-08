import {
  DocumentOutCreateRequestDTO,
  DocumentOutCreateResponseDTO,
} from '../../dto';

export interface DocumentQueueUseCase {
  documentOutCreate(
    documentOutCreateRequestDTO: DocumentOutCreateRequestDTO
  ): Promise<DocumentOutCreateResponseDTO>;
}
