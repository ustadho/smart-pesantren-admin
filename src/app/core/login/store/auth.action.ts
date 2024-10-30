import { createAction, props } from '@ngrx/store';
import { Account } from '../../user/account.model';

export enum AuthActionType {
  LOGIN_START = '[Auth] Login Start',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAIL = '[Auth] Login Fail',
  LOGOUT = '[Auth] Logout',
  SET_CURRENT_ACCOUNT = '[Auth] Set Current Account',
}

export const authenticationStart = createAction(
  AuthActionType.LOGIN_START,
  props<{
    username: string;
    password: string;
    rememberMe: boolean;
  }>()
);
export const authenticationSuccess = createAction(
  AuthActionType.LOGIN_SUCCESS,
  props<{
    currentAccount: Account;
    token: string;
  }>()
);
export const authenticationFail = createAction(AuthActionType.LOGIN_FAIL);
export const logout = createAction(AuthActionType.LOGOUT);
