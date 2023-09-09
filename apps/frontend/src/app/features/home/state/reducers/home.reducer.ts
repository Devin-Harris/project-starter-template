import { CallState } from '@frontend/core/utilities/call-state/call-state';
import { LoadingState } from '@frontend/core/utilities/call-state/loading-state';
import { createFeature, createReducer, on } from '@ngrx/store';
import { HomePageActions } from '../actions/home.actions';

export const homeFeatureKey = 'home';

export interface State {
  callState: CallState;
}

export const initialState: State = {
  callState: LoadingState.Init,
};

export const reducer = createReducer(
  initialState,
  on(HomePageActions.pageEntered, (state, action) => {
    return { ...state };
  })
);

export const homeFeature = createFeature({
  name: homeFeatureKey,
  reducer,
});
