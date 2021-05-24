import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { GravatarModule } from './gravatar';
import { AuthDirective } from './auth.directive';
import { HasRoleDirective } from './has-role.directive';

import { ArticleCardComponent } from './article-card/article-card.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AuthDirective, HasRoleDirective, ArticleCardComponent, ArticleListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    GravatarModule,
    MarkdownModule.forChild(),
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    GravatarModule,
    AuthDirective,
    HasRoleDirective,
    ArticleCardComponent,
    ArticleListComponent,
  ],
})
export class SharedModule {}
