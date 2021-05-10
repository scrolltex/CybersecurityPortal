import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '@app/shared';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AccountSettingsComponent],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
