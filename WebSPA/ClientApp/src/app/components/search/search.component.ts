import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { Article, PaginatedViewModel } from '@app/models';
import { ArticleService } from '@app/services';

const PAGE_SIZE = 20;

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchRequest = '';

  articles$?: Observable<PaginatedViewModel<Article>>;

  constructor(private route: ActivatedRoute, private router: Router, private articleService: ArticleService) {}

  ngOnInit(): void {
    this.searchRequest = this.route.snapshot.queryParamMap.get('searchRequest') ?? '';
    this.articles$ = this.route.queryParamMap.pipe(
      map((params) => {
        const req = params.get('searchRequest') ?? '';
        let pageIndex = Number(params.get('page'));
        if (Number.isNaN(pageIndex)) {
          pageIndex = 0;
        }
        return { req, pageIndex };
      }),
      filter(({ req, pageIndex }) => req != null && req.length > 0),
      switchMap(({ req, pageIndex }) => this.articleService.search(req, PAGE_SIZE, pageIndex))
    );
  }

  _onPageChange(pageIndex: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: pageIndex },
      queryParamsHandling: 'merge',
    });
  }
}
