import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EntityDataModule } from '@ngrx/data';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from './../../environments/environment';
import { entityConfig } from './entity-metadata';
import { appReducer } from './app.reducer';
import { authReducer } from '../core/login/store/auth.reducer';
@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot(appReducer, {}),
    StoreModule.forFeature('auth', authReducer),
    // StoreModule.forFeature('company', companyReducer),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot(entityConfig),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
  ],
})
export class AppStoreModule {}
