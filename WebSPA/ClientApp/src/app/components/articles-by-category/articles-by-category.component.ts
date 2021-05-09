import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Article, PaginatedViewModel } from '@app/models';
import { ArticleService } from '@app/services';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-articles-by-category',
  templateUrl: './articles-by-category.component.html',
  styleUrls: ['./articles-by-category.component.scss'],
})
export class ArticlesByCategoryComponent implements OnInit {
  articles$?: Observable<PaginatedViewModel<Article>>;
  private _categoryId$?: Observable<string>;

  constructor(private route: ActivatedRoute, private router: Router, private articleService: ArticleService) {}

  ngOnInit(): void {
    this._categoryId$ = this.route.paramMap.pipe(map((params) => params.get('categoryId') ?? ''));

    this.articles$ = combineLatest([
      this._categoryId$,
      this.route.queryParamMap.pipe(
        map((params) => {
          let pageIndex = Number(params.get('page'));
          if (Number.isNaN(pageIndex)) {
            pageIndex = 0;
          }
          return pageIndex;
        })
      ),
    ]).pipe(switchMap(([categoryId, pageIndex]) => this.articleService.getAll(PAGE_SIZE, pageIndex, categoryId)));
  }

  _onPageChange(event: PageEvent): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: event.pageIndex } });
  }
}
