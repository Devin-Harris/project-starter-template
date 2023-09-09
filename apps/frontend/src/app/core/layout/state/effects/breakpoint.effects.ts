import { inject } from '@angular/core';
import { Breakpoints } from '@frontend/core/utilities/breakpoints/breakpoints';
import { BreakpointsService } from '@frontend/core/utilities/breakpoints/breakpoints.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { BreakpointActions } from '../actions/breakpoint.actions';
import { LayoutActions } from '../actions/layout.actions';
import { selectLayoutState } from '../selectors/layout.selectors';

export const breakpointChange = createEffect(
  (breakpointService = inject(BreakpointsService), store = inject(Store)) => {
    return breakpointService.screensizeChange().pipe(
      withLatestFrom(store.select(selectLayoutState)),
      switchMap(([breakpoint, state]) => {
        const actions: Action[] = [BreakpointActions.change({ breakpoint })];

        if (
          breakpoint !== Breakpoints.Mobile &&
          state.breakpoint === Breakpoints.Mobile
        ) {
          actions.push(
            LayoutActions.expandLayout({ saveUserPreference: false })
          );
        } else if (
          breakpoint === Breakpoints.Mobile &&
          state.breakpoint !== Breakpoints.Mobile
        ) {
          actions.push(
            LayoutActions.collapseLayout({ saveUserPreference: false })
          );
        }

        return actions;
      })
    );
  },
  { functional: true }
);

export const collapsingMobileMenuOnRouteChange = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(routerNavigatedAction),
      withLatestFrom(store.select(selectLayoutState)),
      filter(([e, state]) => state.breakpoint === Breakpoints.Mobile),
      map(() => {
        return LayoutActions.collapseLayout({ saveUserPreference: false });
      })
    );
  },
  { functional: true }
);
