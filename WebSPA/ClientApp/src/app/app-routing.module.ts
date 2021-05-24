import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticleResolveService } from './services/resolvers/article-resolve.service';

import { ArticleFullComponent } from './components/article-full/article-full.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';
import { ArticlesByCategoryComponent } from './components/articles-by-category/articles-by-category.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { MainComponent } from './components/main/main.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule) },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all',
      },
      {
        path: 'all',
        component: HomeComponent,
      },
      {
        path: 'category/:categoryId',
        component: ArticlesByCategoryComponent,
      },
      {
        path: 'article/new',
        component: CreateArticleComponent,
      },
      {
        path: 'article/:id',
        component: ArticleFullComponent,
        resolve: {
          article: ArticleResolveService,
        },
      },
      {
        path: 'search',
        component: SearchComponent,
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'forbidden',
        component: ForbiddenComponent,
      },
      {
        path: '**',
        redirectTo: '/all',
      },
    ],
  },
  { path: 'categories', loadChildren: () => import('./admin/categories/categories.module').then(m => m.CategoriesModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
