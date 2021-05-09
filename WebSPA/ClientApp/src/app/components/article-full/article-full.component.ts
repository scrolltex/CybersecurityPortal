import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatRelative } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Article } from '@app/models';

@Component({
  selector: 'app-article-full',
  templateUrl: './article-full.component.html',
  styleUrls: ['./article-full.component.scss'],
})
export class ArticleFullComponent {
  article$: Observable<Article>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.article$ = this.route.data.pipe(map((data) => data.article));
  }

  getRelativeDate(article: Article): string {
    return formatRelative(new Date(article.createdAt), new Date(), { locale: ru });
  }
}
