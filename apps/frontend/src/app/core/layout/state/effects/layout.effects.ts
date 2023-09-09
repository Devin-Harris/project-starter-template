import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LayoutApiService } from '../../services/layout.api.service';
import { LayoutActions } from '../actions/layout.actions';

export const loadLayouts = createEffect(
   (
      actions$ = inject(Actions),
      layoutApiService = inject(LayoutApiService)
   ) => {
      return actions$.pipe(
         ofType(
            LayoutActions.loadLayouts
            // TODO: uncomment if we want to allow users to collapse sidemenu and save their user preference when doing so
            // ApplicationStart.initialized
         ),
         switchMap(() =>
            layoutApiService.loadLayout().pipe(
               map((data) => LayoutActions.loadLayoutsSuccess({ data })),
               catchError((error) =>
                  of(LayoutActions.loadLayoutsFailure({ error }))
               )
            )
         )
      );
   },
   { functional: true }
);

export const collapseLayout = createEffect(
   (
      actions$ = inject(Actions),
      layoutApiService = inject(LayoutApiService)
   ) => {
      return actions$.pipe(
         ofType(LayoutActions.collapseLayout),
         switchMap((action) => {
            if (!action.saveUserPreference) {
               return [LayoutActions.collapseLayoutSuccess()];
            }

            return layoutApiService.collapseLayout().pipe(
               map((data) => LayoutActions.collapseLayoutSuccess()),
               catchError((error) =>
                  of(LayoutActions.collapseLayoutFailure({ error }))
               )
            );
         })
      );
   },
   { functional: true }
);
export const expandLayout = createEffect(
   (
      actions$ = inject(Actions),
      layoutApiService = inject(LayoutApiService)
   ) => {
      return actions$.pipe(
         ofType(LayoutActions.expandLayout),
         switchMap((action) => {
            if (!action.saveUserPreference) {
               return [LayoutActions.expandLayoutSuccess()];
            }

            return layoutApiService.expandLayout().pipe(
               map((data) => LayoutActions.expandLayoutSuccess()),
               catchError((error) =>
                  of(LayoutActions.expandLayoutFailure({ error }))
               )
            );
         })
      );
   },
   { functional: true }
);
