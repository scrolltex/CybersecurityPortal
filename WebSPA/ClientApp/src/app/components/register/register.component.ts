import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@ngneat/reactive-forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '@app/core/services';
import { RegisterModel } from '@app/core/models';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup<RegisterModel>;

  constructor(public authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.form = new FormGroup<RegisterModel>({
      userName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  submit(): void {
    const model = this.form.value;
    this.authService.register(model).subscribe({
      next: () => this.router.navigate(['/login']),
    });
  }
}
