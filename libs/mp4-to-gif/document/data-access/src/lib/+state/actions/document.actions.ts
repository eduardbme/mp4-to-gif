import { createAction, props } from '@ngrx/store';
import {
  DocumentOutEntity,
  DocumentOutCreateCmd,
} from '@mp4-to-gif/document/domain';

export const documentOutCreate = createAction(
  '[Document] DocumentOut Create',
  props<{ documentOutCreateCmd: DocumentOutCreateCmd }>()
);
export const documentOutCreateSuccess = createAction(
  '[Document] DocumentOut Create Success',
  props<{ documentOutEntity: DocumentOutEntity }>()
);
export const documentOutCreateFailure = createAction(
  '[Document] DocumentOut Create Failure',
  props<{ error: string }>()
);
