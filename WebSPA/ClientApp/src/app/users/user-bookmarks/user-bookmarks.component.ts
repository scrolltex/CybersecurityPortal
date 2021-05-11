import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Article, PaginatedViewModel } from '@app/models';
import { UserService } from '@app/services';

const PAGE_SIZE = 20;

@Component({
  templateUrl: './user-bookmarks.component.html',
  styleUrls: ['./user-bookmarks.component.scss'],
})
export class UserBookmarksComponent implements OnInit {
  articles$?: Observable<PaginatedViewModel<Article>>;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {}

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
    ]).pipe(switchMap(([pageIndex, userName]) => this.userService.getBookmarks(userName, PAGE_SIZE, pageIndex)));
  }

  _onPageChange(pageIndex: number): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: pageIndex } });
  }
}
