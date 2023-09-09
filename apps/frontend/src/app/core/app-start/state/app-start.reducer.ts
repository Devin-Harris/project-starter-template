import { CallState } from '@frontend/core/utilities/call-state/call-state';
import { LoadingState } from '@frontend/core/utilities/call-state/loading-state';
import { Action, createReducer } from '@ngrx/store';

export interface AppStartState {
  callState: CallState;
}

export const initialState: AppStartState = {
  callState: LoadingState.Init,
};

export const appStartFeatureKey = 'appStart';

const reducer = createReducer(initialState);

export function appStartReducer(
  state: AppStartState | undefined,
  action: Action
) {
  return reducer(state, action);
}
