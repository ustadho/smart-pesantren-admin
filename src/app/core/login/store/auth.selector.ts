import {
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const selectAuthFeature = createFeatureSelector<fromAuth.AuthState>(
  'auth'
);

export const selectCurrentAccount = createSelector(
  selectAuthFeature,
  fromAuth.getCurrentAccount
);

export const metaReducers: MetaReducer<fromAuth.AuthState>[] = [];
