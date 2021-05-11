import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Article, PaginatedViewModel } from '@app/models';
import { ArticleService } from '@app/services';

const PAGE_SIZE = 20;

@Component({
  templateUrl: './user-articles.component.html',
  styleUrls: ['./user-articles.component.scss'],
})
export class UserArticlesComponent implements OnInit {
  articles$?: Observable<PaginatedViewModel<Article>>;

  constructor(private route: ActivatedRoute, private router: Router, private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articles$ = combineLatest([
      this.route.queryParamMap.pipe(
        map((params) => {
          let pageIndex = Number(params.get('page'));
          if (Number.isNaN(pageIndex)) {
            pageIndex = 0;
          }
          return pageIndex;
        })
      ),
      this.route.parent!.paramMap.pipe(map((params) => params.get('userName') ?? '')),
    ]).pipe(
      switchMap(([pageIndex, userName]) => this.articleService.getAll(PAGE_SIZE, pageIndex, undefined, userName))
    );
  }

  _onPageChange(event: PageEvent): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: event.pageIndex } });
  }
}
