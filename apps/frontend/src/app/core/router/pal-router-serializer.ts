import { Params, RouterStateSnapshot } from '@angular/router';
import {
   BaseRouterStoreState,
   RouterStateSerializer,
} from '@ngrx/router-store';

export interface PalRouterState extends BaseRouterStoreState {
   url: string;
   params: Params;
   queryParams: Params;
   data: any;
}

export class PalRouterSerializer
   implements RouterStateSerializer<PalRouterState>
{
   serialize(routerState: RouterStateSnapshot): PalRouterState {
      let route = routerState.root;

      while (route.firstChild) {
         route = route.firstChild;
      }

      const {
         url,
         root: { queryParams },
      } = routerState;
      const { params, data } = route;

      return { url, params, queryParams, data };
   }
}
