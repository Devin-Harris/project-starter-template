import { QueryParamsHandling } from '@angular/router';

export interface MenuItem {
   name: string;
   icon?: string;
   tooltip?: string;
   routerLink?: string;
   queryParamsHandling?: QueryParamsHandling | null;
   children?: MenuItem[];
}

export const PAL_NAV_LINKS: MenuItem[] = [
   {
      routerLink: '/home',
      name: 'Home',
      icon: 'home',
   },
];
