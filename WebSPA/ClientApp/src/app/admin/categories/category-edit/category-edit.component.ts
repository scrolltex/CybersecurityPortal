import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Category } from '@app/models';

@Component({
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss'],
})
export class CategoryEditComponent {
  form: FormGroup<Category>;

  constructor(private dialogRef: MatDialogRef<CategoryEditComponent>, @Inject(MAT_DIALOG_DATA) category?: Category) {
    this.form = new FormGroup<Category>({
      id: new FormControl(category?.id),
      name: new FormControl(category?.name ?? '', Validators.required),
    });
  }
}
