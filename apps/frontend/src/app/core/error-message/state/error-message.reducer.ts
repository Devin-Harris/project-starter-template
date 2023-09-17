import { HttpException } from '@nestjs/common';
import { createReducer, on } from '@ngrx/store';
import { ErrorActions } from './error-message.actions';

export const featureKey = 'errorMessage';

export interface FeatureState {
  errors: HttpException[];
}

export const initialState: FeatureState = {
  errors: new Array<HttpException>(),
};

export const errorMessageReducer = createReducer(
  initialState,
  on(ErrorActions.showError, (state, action) => {
    return {
      ...state,
      errors: [...state.errors, action.error],
    };
  })
);
