import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { DocumentOutEntityRaw } from '@mp4-to-gif/document/domain';
import { DocumentActions } from '../actions';

interface DocumentState extends EntityState<DocumentOutEntityRaw> {
  successed: number;
  errored: number;
}

const documentAdapter: EntityAdapter<DocumentOutEntityRaw> =
  createEntityAdapter<DocumentOutEntityRaw>();

const initialState: DocumentState = documentAdapter.getInitialState({
  successed: 0,
  errored: 0,
});

const reducer = createReducer(
  initialState,
  on(DocumentActions.documentOutCreateSuccess, (state) => ({
    ...state,
    successed: state.successed + 1,
  })),
  on(DocumentActions.documentOutCreateFailure, (state) => ({
    ...state,
    errored: state.errored + 1,
  }))
);

export const documentFeature = createFeature({
  name: 'document',
  reducer,
});
