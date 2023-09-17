import { QueryParamsHandling, Route } from '@angular/router';

export interface MenuItem extends Route {
  name: string;
  icon?: string;
  tooltip?: string;
  queryParamsHandling?: QueryParamsHandling | null;
  children?: MenuItem[];
}

export const LAYOUT_NAV_LINKS: MenuItem[] = [
  {
    path: 'home',
    name: 'Home',
    icon: 'home',
    loadChildren: () =>
      import('@frontend/features/home/home.routes').then(
        (mod) => mod.HOME_ROUTES
      ),
  },
  {
    path: 'test',
    name: 'Test',
    icon: 'assignment',
    loadChildren: () =>
      import('@frontend/features/home/home.routes').then(
        (mod) => mod.HOME_ROUTES
      ),
  },
];
