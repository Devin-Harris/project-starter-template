import { selectUrl } from '@frontend/core/router/router.selector';
import { Breakpoints } from '@frontend/core/utilities/breakpoints/breakpoints';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromLayout from '../reducers/layout.reducer';

export const selectLayoutState = createFeatureSelector<fromLayout.State>(
  fromLayout.layoutFeatureKey
);

const navLinks = fromLayout.layoutFeature.selectNavLinks;

export const selectNavLinks = createSelector(
  navLinks,
  selectUrl,
  (navs, url) => {
    return navs.map((nav) => ({
      ...nav,
      isActive: nav.path == url,
    }));
  }
);

export const getCallState = createSelector(selectLayoutState, (state) => {
  return state.callState;
});

export const getNavigationState = createSelector(
  selectLayoutState,
  selectNavLinks,
  (state, navlinks) => {
    return {
      ...state,
      navlinks,
      activeItem: navlinks.find((a) => a.isActive) ?? [],
      isMobile: state.breakpoint === Breakpoints.Mobile,
      isTablet: state.breakpoint === Breakpoints.Tablet,
      isLaptop: state.breakpoint === Breakpoints.Laptop,
      isDesktop: state.breakpoint === Breakpoints.Desktop,
    };
  }
);
