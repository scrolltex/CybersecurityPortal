import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserArticlesComponent } from './user-articles/user-articles.component';
import { UserBookmarksComponent } from './user-bookmarks/user-bookmarks.component';

const routes: Routes = [
  {
    path: ':userName',
    component: UserDetailComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'articles',
      },
      {
        path: 'articles',
        component: UserArticlesComponent,
      },
      {
        path: 'bookmarks',
        component: UserBookmarksComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
