import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticleFullComponent } from './components/article-full/article-full.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';
import { ArticlesByCategoryComponent } from './components/articles-by-category/articles-by-category.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
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
        path: 'category/:id',
        component: ArticlesByCategoryComponent,
      },
      {
        path: 'article/new',
        component: CreateArticleComponent,
      },
      {
        path: 'article/:id',
        component: ArticleFullComponent,
      },
      {
        path: 'search',
        component: SearchComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
