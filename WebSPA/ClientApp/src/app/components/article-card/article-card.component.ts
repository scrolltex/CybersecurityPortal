import { Component, Inject, Input } from '@angular/core';
import { formatRelative } from 'date-fns';
import { ru } from 'date-fns/locale';
import { LOCATION, NAVIGATOR } from '@ng-web-apis/common';

import { Article } from '@app/models';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
})
export class ArticleCardComponent {
  @Input() article?: Article;

  constructor(@Inject(LOCATION) private location: Location, @Inject(NAVIGATOR) private navigator: Navigator) {}

  getRelativeDate(article: Article): string {
    return formatRelative(new Date(article.createdAt), new Date(), { locale: ru });
  }

  like(): void {}

  bookmark(): void {}

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
