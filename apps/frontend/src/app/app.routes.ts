import { Routes } from '@angular/router';
import { LayoutComponent } from '@frontend/core/layout/layout.component';
import { LAYOUT_ROUTES } from './layout.routes';
import { NON_LAYOUT_ROUTES } from './non-layout.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  ...NON_LAYOUT_ROUTES,
  {
    // canActivate: [authenticationGuard],
    component: LayoutComponent,
    path: '',
    children: LAYOUT_ROUTES,
  },
];
