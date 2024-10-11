import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(
    private http: HttpClient,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService
  ) {}

  getToken() {
    return (
      this.$localStorage.retrieve('authenticationToken') ||
      this.$sessionStorage.retrieve('authenticationToken')
    );
  }

  login(credentials: any): Observable<any> {
    const data = {
      username: credentials.username,
      password: credentials.password,
      rememberMe: credentials.rememberMe,
    };
    return this.http
      .post('api/authenticate', data, {
        observe: 'response',
      })
      .pipe(map(this.authenticateSuccess.bind(this, credentials)));
  }

  private authenticateSuccess = (credentials: any, resp: any) => {
    const bearerToken = resp.headers.get('Authorization');
    if (bearerToken && bearerToken.startsWith('Bearer ')) {
      const jwt = bearerToken.slice(7);
      this.storeAuthenticationToken(jwt, credentials.rememberMe);
      return jwt;
    }
  };

  loginWithToken(jwt: any, rememberMe: any) {
    if (jwt) {
      this.storeAuthenticationToken(jwt, rememberMe);
      return Promise.resolve(jwt);
    } else {
      return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
    }
  }

  storeAuthenticationToken(jwt: string, rememberMe: boolean): void {
    if (rememberMe) {
      this.$localStorage.store('authenticationToken', jwt);
    } else {
      this.$sessionStorage.store('authenticationToken', jwt);
    }
  }

  logout(): Observable<any> {
    return new Observable((observer) => {
      this.$localStorage.clear('authenticationToken');
      this.$sessionStorage.clear('authenticationToken');
      observer.complete();
    });
  }
}
