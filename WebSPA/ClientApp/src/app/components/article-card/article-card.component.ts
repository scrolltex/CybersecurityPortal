import { Component, Inject, Input } from '@angular/core';
import { formatRelative } from 'date-fns';
import { ru } from 'date-fns/locale';
import { LOCATION, NAVIGATOR } from '@ng-web-apis/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Article } from '@app/models';
import { ArticleService } from '@app/services';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
})
export class ArticleCardComponent {
  @Input() article?: Article;

  constructor(
    @Inject(LOCATION) private location: Location,
    @Inject(NAVIGATOR) private navigator: Navigator,
    private articleService: ArticleService,
    private snackBar: MatSnackBar
  ) {}

  getRelativeDate(article: Article): string {
    return formatRelative(new Date(article.createdAt), new Date(), { locale: ru });
  }

  like(): void {
    if (this.article == null) {
      return;
    }
    this.articleService.toggleLike(this.article.id).subscribe((result) => {
      if (this.article != null) {
        this.article.userState.userLikes = result.state;
        this.article.stats.likes = result.count;
      }
      if (result.state) {
        this.snackBar.open('Статья вам нравится');
      } else {
        this.snackBar.open('Статья вам больше не нравится');
      }
    });
  }

  bookmark(): void {
    if (this.article == null) {
      return;
    }
    this.articleService.toggleBookmark(this.article.id).subscribe((state) => {
      if (this.article != null) {
        this.article.userState.userBookmark = state;
      }
      if (state) {
        this.snackBar.open('Статья добавлена в закладки');
      } else {
        this.snackBar.open('Статья удалена из закладок');
      }
    });
  }

  share(): void {
    if (this.article == null) {
      return;
    }
    this.navigator.share({
      title: this.article.title,
      url: `//${this.location.host}/article/${this.article.id}`,
    });
  }
}
