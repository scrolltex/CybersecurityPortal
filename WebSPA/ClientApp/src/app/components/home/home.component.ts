import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Article, PaginatedViewModel } from '@app/models';
import { ArticleService } from '@app/services';

const PAGE_SIZE = 20;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  articles$?: Observable<PaginatedViewModel<Article>>;

  constructor(private route: ActivatedRoute, private router: Router, private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articles$ = this.route.queryParamMap.pipe(
      map((params) => {
        let pageIndex = Number(params.get('page'));
        if (Number.isNaN(pageIndex)) {
          pageIndex = 0;
        }
        return pageIndex;
      }),
      switchMap((pageIndex) => this.articleService.getAll(PAGE_SIZE, pageIndex))
    );
  }

  _onPageChange(pageIndex: number): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: pageIndex } });
  }
}
