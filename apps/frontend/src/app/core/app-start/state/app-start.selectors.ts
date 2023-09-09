import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppStartState, appStartFeatureKey } from './app-start.reducer';

const appStartFeatureSelector =
   createFeatureSelector<AppStartState>(appStartFeatureKey);

export const getAppStartCallState = createSelector(
   appStartFeatureSelector,
   (state) => {
      return state.callState;
   }
);
