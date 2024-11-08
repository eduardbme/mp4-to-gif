import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DocumentOutEntity } from '@mp4-to-gif/document/domain';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { DocumentActions } from '../actions';
import { DocumentOutCreateRequestDTO } from '../dto';
import { DocumentService } from '../services';

@Injectable()
export class DocumentEffects {
  private readonly actions$ = inject(Actions);
  private readonly documentService = inject(DocumentService);

  documentOutCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentActions.documentOutCreate),
      mergeMap((_) =>
        this.documentService
          .documentOutCreate(
            new DocumentOutCreateRequestDTO({
              documentInFile: _.documentOutCreateCmd.data.documentInFile,
            })
          )
          .pipe(
            mergeMap((_) => [
              DocumentActions.documentOutCreateSuccess({
                documentOutEntity: new DocumentOutEntity({
                  documentKey: _.data.documentKey,
                }),
              }),
            ]),
            catchError((_: Error) => [
              DocumentActions.documentOutCreateFailure({
                error: _.message,
              }),
            ])
          )
      )
    )
  );
}
