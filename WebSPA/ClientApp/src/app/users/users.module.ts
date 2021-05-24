import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { UsersRoutingModule } from './users-routing.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserArticlesComponent } from './user-articles/user-articles.component';
import { UserBookmarksComponent } from './user-bookmarks/user-bookmarks.component';

@NgModule({
  declarations: [UserDetailComponent, UserArticlesComponent, UserBookmarksComponent],
  imports: [SharedModule, UsersRoutingModule],
})
export class UsersModule {}
