import { Breakpoints } from '@frontend/core/utilities/breakpoints/breakpoints';
import { CallState } from '@frontend/core/utilities/call-state/call-state';
import { LoadingState } from '@frontend/core/utilities/call-state/loading-state';
import { createFeature, createReducer, on } from '@ngrx/store';
import { BreakpointActions } from '../actions/breakpoint.actions';
import { LayoutActions } from '../actions/layout.actions';
import { LAYOUT_NAV_LINKS, MenuItem } from '../models/nav-link.model';

export const layoutFeatureKey = 'layout';

export interface State {
  navLinks: MenuItem[];
  expanded: boolean;
  callState: CallState;
  breakpoint: Breakpoints | null;
}

export const initialState: State = {
  navLinks: LAYOUT_NAV_LINKS,
  expanded: true,
  callState: LoadingState.Init,
  breakpoint: null,
};

export const reducer = createReducer(
  initialState,
  on(LayoutActions.loadLayouts, (state) => {
    return {
      ...state,
      callState: LoadingState.Loading,
    };
  }),
  on(LayoutActions.loadLayoutsSuccess, (state, action) => {
    return {
      ...state,
      expanded: action.data.expandMenu,
      callState: LoadingState.Loaded,
    };
  }),
  on(LayoutActions.loadLayoutsFailure, (state, action) => {
    return {
      ...state,
      callState: { error: action.error },
    };
  }),
  on(LayoutActions.expandLayout, (state, action) => ({
    ...state,
    expanded: true,
  })),
  on(LayoutActions.collapseLayout, (state, action) => ({
    ...state,
    expanded: false,
  })),
  on(BreakpointActions.change, (state, action) => {
    return {
      ...state,
      breakpoint: action.breakpoint,
    };
  })
);

export const layoutFeature = createFeature({
  name: layoutFeatureKey,
  reducer,
});
