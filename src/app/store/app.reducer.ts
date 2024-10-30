import { environment } from '../../../src/environments/environment';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromAuth from '../core/login/store/auth.reducer';

import { storeFreeze } from 'ngrx-store-freeze';

export interface AppState {
  auth: fromAuth.AuthState;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [storeFreeze]
  : [];
