import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@ngneat/reactive-forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '@app/core/services';
import { SignInModel } from '@app/core/models';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup<SignInModel>;

  constructor(public authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.form = new FormGroup<SignInModel>({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  login(): void {
    const model = this.form.value;
    this.authService.auth(model).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.snackBar.open(`Не верный логин и(или) пароль`);
            return;
          }
        }
        throw err;
      },
    });
  }
}
