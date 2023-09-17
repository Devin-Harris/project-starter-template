import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { Providers } from '@frontend/core/providers';
import { PalRouterSerializer } from '@frontend/core/router/pal-router-serializer';
import { CoreEffects } from '@frontend/core/store/effects';
import * as fromState from '@frontend/core/store/reducers';
import { provideEffects } from '@ngrx/effects';
import { NavigationActionTiming, provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(MatDialogModule),
    provideRouter(routes),
    provideStore(fromState.reducers),
    provideEffects(...CoreEffects),
    provideRouterStore({
      serializer: PalRouterSerializer,
      navigationActionTiming: NavigationActionTiming.PostActivation,
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideAnimations(),
    provideHttpClient(),
    [...Providers],
  ],
};
