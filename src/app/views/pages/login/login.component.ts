import { Component } from '@angular/core';
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
import { StateStorageService } from 'src/app/core/auth/state-storage.service';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/core/login/store/auth.action'
import * as AuthSelector from 'src/app/core/login/store/auth.selector';
import { Router } from '@angular/router';


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
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    ReactiveFormsModule
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  authenticationError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private stateStorageService: StateStorageService,
    private store: Store<fromApp.AppState>
    ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('submit')
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).then((response: any) => {
        localStorage.setItem('authenticationToken', response);

        this.authenticationError = false;

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
      });
    }
  }
}
