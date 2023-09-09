import { createFeatureSelector } from '@ngrx/store';
import * as fromHome from '../reducers/home.reducer';

export const selectHomeState = createFeatureSelector<fromHome.State>(
   fromHome.homeFeatureKey
);
