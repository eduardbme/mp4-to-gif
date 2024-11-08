import { createAction, props } from '@ngrx/store';
import { ApiError } from '@youm-front/api/domain';

export const apiError = createAction(
  '[Api] Error',
  props<{ error: ApiError }>()
);
