import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { MarkdownModule } from 'ngx-markdown';

import { SharedModule } from './shared';
import { CoreModule } from './core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ArticleFullComponent } from './components/article-full/article-full.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';
import { ArticlesByCategoryComponent } from './components/articles-by-category/articles-by-category.component';
import { HomeComponent } from './components/home/home.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { SearchComponent } from './components/search/search.component';
import { MainComponent } from './components/main/main.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleFullComponent,
    CreateArticleComponent,
    ArticlesByCategoryComponent,
    HomeComponent,
    ThemeToggleComponent,
    SearchComponent,
    MainComponent,
    ForbiddenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    LoadingBarModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    MarkdownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
