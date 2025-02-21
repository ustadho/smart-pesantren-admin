import { Injectable } from '@angular/core';

import { AccountService } from '../auth/account.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from '../login/store/auth.action'


@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  login(credentials: any, callback?: any) {
    const cb = callback || function () {};

    return new Promise((resolve, reject) => {
      this.authServerProvider.login(credentials).subscribe(
        (data) => {
          this.accountService.identity(true).then((account) => {
            resolve(data);
          });
          return cb();
        },
        (err) => {
          this.store.dispatch(
            AuthActions.authenticationFail()
          );
          this.logout();
          reject(err);
          return cb(err);
        }
      );
    });
  }

  loginWithToken(jwt: any, rememberMe: any) {
    return this.authServerProvider.loginWithToken(jwt, rememberMe);
  }

  logout() {
    this.authServerProvider.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.log('loginService.logout err', err);
      }
    })
    this.accountService.authenticate(null);
  }
}
