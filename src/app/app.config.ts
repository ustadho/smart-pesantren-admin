import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { AuthInterceptor } from '../app/core/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from '../app/core/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from '../app/core/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from '../app/core/interceptor/notification.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig, withSessionStorage } from 'ngx-webstorage';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandlerFn, HttpRequest, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { authReducer } from './core/login/store/auth.reducer';
import { Observable } from 'rxjs';
import { provideToastr } from 'ngx-toastr';
import { provideNgProgressOptions } from 'ngx-progressbar';
import { progressInterceptor } from 'ngx-progressbar/http';
import { TimeZoneInterceptor } from './core/interceptor/timezone.interceptor';
import { provideDaterangepickerLocale } from "ngx-daterangepicker-bootstrap";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    provideDaterangepickerLocale({
      separator: ' - ',
      applyLabel: 'Okay',
    }),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch(),
      withInterceptors([progressInterceptor])
    ),
    provideNgProgressOptions({
      // color: '#3f51b5',
      // thick: true,
      spinner: true,
      // fixed: true,
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimeZoneInterceptor,
      multi: true,
    },
    provideNgxWebstorage(
      withNgxWebstorageConfig({ separator: ':', caseSensitive: true }),
      withLocalStorage(),
      withSessionStorage()
    ),
    provideStore(),
    provideState({ name: 'auth', reducer: authReducer }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    }),
    provideToastr(),
  ]
};

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
