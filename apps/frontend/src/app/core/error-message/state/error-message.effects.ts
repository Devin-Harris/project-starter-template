import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, tap } from 'rxjs/operators';

import { ofTypeErrorMessage } from '../models/error-message-operator';
import { ErrorMessageService } from '../services/error-message.service';
import { ErrorActions } from './error-message.actions';

export const $showError = createEffect(
  (
    actions$ = inject(Actions),
    errorMessageService = inject(ErrorMessageService)
  ) => {
    return actions$.pipe(
      ofType(ErrorActions.showError),
      tap((action) => {
        errorMessageService.openErrorDialog(action.error);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const $errorOccurred = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofTypeErrorMessage(),
      filter((action) => !!action.showAsErrorDialog),
      map((action) => {
        if (!!action.showAsErrorDialog) {
          return ErrorActions.showError({ error: action.error });
        }

        return ErrorActions.errorIgnored(action);
      })
    );
  },
  { functional: true }
);
