import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeServiceFromSelector } from '@frontend/core/utilities/state-service/facade-service-from-selector.interface';
import { LayoutActions } from '../state/actions/layout.actions';
import { getNavigationState } from '../state/selectors/layout.selectors';

@Injectable({
  providedIn: 'root',
})
export class NavbarStateService extends FacadeServiceFromSelector(
  getNavigationState
) {
  readonly router = inject(Router);

  toggleMenu(saveUserPreference = true) {
    this.$data().expanded
      ? this.collapseMenu(saveUserPreference)
      : this.expandMenu(saveUserPreference);
  }

  collapseMenu(saveUserPreference = true) {
    this.dispatch(LayoutActions.collapseLayout({ saveUserPreference }));
  }

  expandMenu(saveUserPreference = true) {
    this.dispatch(LayoutActions.expandLayout({ saveUserPreference }));
  }
}
