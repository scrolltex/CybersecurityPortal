import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizeGuard, UnAuthorizeGuard } from '@app/core/guards';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [UnAuthorizeGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [UnAuthorizeGuard],
      },
      {
        path: 'settings',
        component: AccountSettingsComponent,
        canActivate: [AuthorizeGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
