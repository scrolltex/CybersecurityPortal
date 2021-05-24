import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap } from 'rxjs/operators';

import { Category } from '@app/models';
import { CategoryService } from '@app/services';
import { CategoryDeleteComponent } from './category-delete/category-delete.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  categories$ = this.categoryService.getAll();

  constructor(private categoryService: CategoryService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  refresh(): void {
    this.categories$ = this.categoryService.getAll();
  }

  add(): void {
    this.dialog
      .open(CategoryEditComponent)
      .afterClosed()
      .pipe(
        filter((category) => !!category),
        switchMap((category) => this.categoryService.create(category))
      )
      .subscribe((category) => {
        this.snackBar.open('Категория добавлена!');
        this.refresh();
      });
  }

  edit(oldCategory: Category): void {
    this.dialog
      .open(CategoryEditComponent, { data: oldCategory })
      .afterClosed()
      .pipe(
        filter((category) => !!category),
        switchMap((category) => this.categoryService.update(category))
      )
      .subscribe(() => {
        this.snackBar.open('Категория обновлена!');
        this.refresh();
      });
  }

  delete(category: Category): void {
    this.dialog
      .open(CategoryDeleteComponent)
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        switchMap(() => this.categoryService.delete(category.id))
      )
      .subscribe(() => {
        this.snackBar.open('Категория удалена!');
        this.refresh();
      });
  }
}
