import { Component, OnInit, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../core/login/login.service';
import { StateStorageService } from '../../../core/auth/state-storage.service';
import { Store, select } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as AuthSelector from '../../../core/login/store/auth.selector';
import { Router } from '@angular/router';
import { AlertComponent } from '@coreui/angular';
import { Account } from '../../../core/user/account.model';
import { map, Observable } from 'rxjs';
import { AccountService } from '../../../core/auth/account.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    ReactiveFormsModule,
    AlertComponent,
  ],
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  authenticationError: boolean = false;
  account$: Observable<Account | null>;
  currentAccount: Account | null = null ;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private accountService: AccountService,
    private router: Router,
    private stateStorageService: StateStorageService,
    private store: Store<fromApp.AppState>
    ) {
      this.account$ = this.store.pipe(
        select(AuthSelector.selectCurrentAccount),
        map((account) => account ?? {} as Account)
      );

      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        rememberMe: [true],
      });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting.set(true);
      this.loginService.login(this.loginForm.value).then((response: any) => {
        localStorage.setItem('authenticationToken', response);

        this.authenticationError = false;
        this.isSubmitting.set(false);
        // previousState was set in the authExpiredInterceptor before being redirected to login modal.
        // since login is successful, go to stored previousState and clear previousState
        const redirect = this.stateStorageService.getUrl();
        this.store.select('auth').subscribe(data => {
          if(redirect) {
            this.stateStorageService.storeUrl('');
            this.router.navigate([redirect]);
          } else {
              this.router.navigate(['/']);
          }

        });
      })
      .catch((err) => {
        this.isSubmitting.set(false);
        console.log('catchError', err)
        this.authenticationError = true;
      });
    }
  }

  ngOnInit() {
    this.accountService.identity().then(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
   }
}
