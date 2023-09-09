import { Routes } from '@angular/router';

export const LAYOUT_ROUTES: Routes = [
  {
    path: 'home',
    //canActivate: [authenticationGuard],
    loadChildren: () =>
      import('./features/home/home.routes').then((mod) => mod.HOME_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
