import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeService } from '../../services/home.service';
import { HomePageActions } from '../actions/home.actions';

export const homePageEntered = createEffect(
   (
      actions$ = inject(Actions),
      homeService = inject(HomeService),
      store = inject(Store)
   ) => {
      return actions$.pipe(
         ofType(HomePageActions.pageEntered),
         map((action) => {
            return EMPTY;
         })
      );
   },
   { functional: true, dispatch: false }
);
