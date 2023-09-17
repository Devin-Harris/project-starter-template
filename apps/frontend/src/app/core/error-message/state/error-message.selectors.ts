import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, FeatureState } from './error-message.reducer';

export const selectErrorMessageFeature = createFeatureSelector<FeatureState>(featureKey);

export const selectLastError = createSelector(selectErrorMessageFeature, (state: FeatureState) => {
   return state.errors.length > 0 ? state.errors[state.errors.length - 1] : null;
});
