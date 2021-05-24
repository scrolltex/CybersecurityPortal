import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryDeleteComponent } from './category-delete/category-delete.component';

@NgModule({
  declarations: [CategoriesComponent, CategoryEditComponent, CategoryDeleteComponent],
  imports: [SharedModule, CategoriesRoutingModule],
})
export class CategoriesModule {}
