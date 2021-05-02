import { Component, Input } from '@angular/core';
import { formatRelative } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Article } from '@app/models';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent {
  @Input() articles?: Article[];

  getRelativeDate(article: Article): string {
    return formatRelative(new Date(article.createdAt), new Date(), { locale: ru });
  }
}
