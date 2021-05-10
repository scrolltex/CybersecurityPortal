import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormControl } from '@ngneat/reactive-forms';

import { AuthService } from '@app/core/services';

@Component({
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent {
  currentPasswordControl = new FormControl<string>('', Validators.required);
  newPasswordControl = new FormControl<string>('', Validators.required);
  newEmailControl = new FormControl<string>('', [Validators.required, Validators.email]);

  constructor(private authService: AuthService) {}

  get canChangeEmail(): boolean {
    return this.currentPasswordControl.valid && this.newEmailControl.valid;
  }

  changeEmail(): void {
    this.authService
      .changeEmail({
        currentPassword: this.currentPasswordControl.value,
        newEmail: this.newEmailControl.value,
      })
      .subscribe(() => this.reset());
  }

  get canChangePassword(): boolean {
    return this.currentPasswordControl.valid && this.newPasswordControl.valid;
  }

  changePassword(): void {
    this.authService
      .changePassword({
        currentPassword: this.currentPasswordControl.value,
        newPassword: this.newPasswordControl.value,
      })
      .subscribe(() => this.reset());
  }

  reset(): void {
    this.currentPasswordControl.reset();
    this.newEmailControl.reset();
    this.newPasswordControl.reset();
  }
}
