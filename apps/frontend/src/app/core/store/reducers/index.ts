import { isDevMode } from '@angular/core';
import * as fromLayout from '@frontend/core/layout/state/reducers/layout.reducer';
import { PalRouterState } from '@frontend/core/router/pal-router-serializer';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromAppStart from '../../app-start/state/app-start.reducer';

export const stateFeatureKey = 'state';

export interface State {
  router: RouterReducerState<PalRouterState>;
  [fromAppStart.appStartFeatureKey]: fromAppStart.AppStartState;
  [fromLayout.layoutFeatureKey]: fromLayout.State;
}

export const reducers: ActionReducerMap<State> = {
  router: routerReducer,
  [fromAppStart.appStartFeatureKey]: fromAppStart.appStartReducer,
  [fromLayout.layoutFeatureKey]: fromLayout.reducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
