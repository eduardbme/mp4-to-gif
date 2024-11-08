import { Injectable } from '@angular/core';
import { ApiService } from '@mp4-to-gif/api/data-access';
import { map, Observable } from 'rxjs';
import {
  DocumentOutCreateRequestDTO,
  DocumentOutCreateResponseDTO,
  DocumentOutCreateResponseDTORaw,
} from '../dto';

@Injectable()
export class DocumentService {
  constructor(private readonly apiService: ApiService) {}

  documentOutCreate(
    documentOutCreateRequestDTO: DocumentOutCreateRequestDTO
  ): Observable<DocumentOutCreateResponseDTO> {
    const { documentInFile } = documentOutCreateRequestDTO.data;
    const formData = new FormData();

    formData.set('file', documentInFile);

    return this.apiService
      .post<DocumentOutCreateResponseDTORaw>(`/api/v1/documents`, formData)
      .pipe(map((_) => new DocumentOutCreateResponseDTO(_)));
  }
}
