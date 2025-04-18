import { Injectable } from '@angular/core';
import { SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from '../login/store/auth.action'

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: any;
  private authenticated = false;
  private authenticationState = new Subject<any>();

  constructor(
    private sessionStorage: SessionStorageService,
    private $localStorage: LocalStorageService,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
    ) { }

  fetch(): Observable<HttpResponse<any>> {
    return this.http.get<any>('api/account', { observe: 'response' });
  }

  save(account: any): Observable<HttpResponse<any>> {
    return this.http.post('api/account', account, { observe: 'response' });
  }

  authenticate(identity: any) {
    this.userIdentity = identity;
    this.authenticated = identity !== null;
    this.authenticationState.next(this.userIdentity);
    if (identity == null) {
      this.$localStorage.clear('authenticationToken');
      this.sessionStorage.clear('authenticationToken');
    }
  }

  hasAnyAuthority(authorities: string[]): boolean {
    if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
      return false;
    }

    for (let i = 0; i < authorities.length; i++) {
      if (this.userIdentity.authorities.includes(authorities[i])) {
        return true;
      }
    }

    return false;
  }

  hasAuthority(authority: string): Promise<boolean> {
    if (!this.authenticated) {
      return Promise.resolve(false);
    }

    return this.identity().then(
      id => {
        return Promise.resolve(id.authorities && id.authorities.includes(authority));
      },
      () => {
        return Promise.resolve(false);
      }
    );
  }

  identity(force?: boolean): Promise<any> {
    if (force) {
      this.userIdentity = undefined;
    }

    // check and see if we have retrieved the userIdentity data from the server.
    // if we have, reuse it by immediately resolving
    if (this.userIdentity) {
      return Promise.resolve(this.userIdentity);
    }

    // retrieve the userIdentity data from the server, update the identity object, and then resolve.
    return this.fetch()
      .toPromise()
      .then((response: any) => {
        const account = response.body;
        if (account) {
          this.userIdentity = account;
          this.authenticated = true;
          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          const langKey = this.sessionStorage.retrieve('locale') || this.userIdentity.langKey;
          // this.languageService.changeLanguage(langKey);
          const token = this.$localStorage.retrieve('authenticationToken') || this.sessionStorage.retrieve('authenticationToken');

          this.store.dispatch(
            AuthActions.authenticationSuccess({
              currentAccount: account,
              token: token,
            })
          );
        } else {
          this.userIdentity = null;
          this.authenticated = false;
        }
        this.authenticationState.next(this.userIdentity);
        return this.userIdentity;
      })
      .catch(err => {
        this.userIdentity = null;
        this.authenticated = false;
        this.authenticationState.next(this.userIdentity);
        return null;
      });
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  isIdentityResolved(): boolean {
    return this.userIdentity !== undefined;
  }

  getAuthenticationState(): Observable<any> {
    return this.authenticationState.asObservable();
  }

  getImageUrl(): string {
    return this.isIdentityResolved() ? this.userIdentity.imageUrl : null;
  }

  resetDefaultPassword(id: string) {
    return this.http.put(`api/account/reset-password/${id}`, { observe: 'response' });
  }
}
