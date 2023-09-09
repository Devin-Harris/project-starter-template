import { Route } from '@angular/router';

export type PalRouteData = {
   activeNavLink?: string;
};

export type PalRoute = Route & {
   data?: PalRouteData;
};

export type PalRoutes = PalRoute[];
