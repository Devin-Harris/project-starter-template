import { Routes } from '@angular/router';
import { LAYOUT_NAV_LINKS } from './core/layout/state/models/nav-link.model';

export const LAYOUT_ROUTES: Routes = [
  ...LAYOUT_NAV_LINKS,
  {
    path: '**',
    redirectTo: 'home',
  },
];
