import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from '@app/core/guards';

import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthorizeGuard],
    data: {
      expectedRole: 'admin',
    },
    children: [
      {
        path: 'categories',
        loadChildren: () => import('./categories/categories.module').then((m) => m.CategoriesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
