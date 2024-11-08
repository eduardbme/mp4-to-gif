import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DocumentOutCreateCmd } from '@mp4-to-gif/document/domain';
import { DocumentActions } from '../actions';
import { documentFeature } from '../reducers';

@Injectable()
export class DocumentFacade {
  private readonly store = inject(Store);

  readonly errored$ = this.store.pipe(select(documentFeature.selectErrored));
  readonly successed$ = this.store.pipe(
    select(documentFeature.selectSuccessed)
  );

  documentOutCreate(documentOutCreateCmd: DocumentOutCreateCmd): void {
    this.store.dispatch(
      DocumentActions.documentOutCreate({ documentOutCreateCmd })
    );
  }
}
