import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { HomeComponent } from './home.component';
import { HomeEffects } from './state/effects';
import { homeFeature } from './state/reducers/home.reducer';

export const HOME_ROUTES: Route[] = [
   {
      path: '',
      pathMatch: 'full',
      component: HomeComponent,
      providers: [provideState(homeFeature), provideEffects(HomeEffects)],
   },
];
