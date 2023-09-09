import { APP_INITIALIZER } from '@angular/core';
import { AppStartService } from '@frontend/core/app-start/services/app-start.service';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';

export const AppInitializerProvider = {
  provide: APP_INITIALIZER,
  useFactory: (appStartService: AppStartService, store: Store) => () => {
    appStartService.initialize();
    // use store.select pipes to wait for certain things to be fully loaded before continuing with app initialization
    return EMPTY;
  },
  deps: [AppStartService, Store],
  multi: true,
};
