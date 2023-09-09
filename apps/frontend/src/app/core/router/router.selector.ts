import { State } from '@frontend/core/store/reducers';
import { createSelector } from '@ngrx/store';

const routerFeatureState = (state: State) => state.router;

export const selectRouterState = createSelector(
  routerFeatureState,
  (state) => state.state
);

export const selectUrl = createSelector(
  selectRouterState,
  (state) => state.url
);

export const selectParams = createSelector(
  selectRouterState,
  (state) => state.params
);

export const selectQueryParams = createSelector(
  selectRouterState,
  (state) => state.queryParams
);

export const selectData = createSelector(
  selectRouterState,
  (state) => state.data
);
