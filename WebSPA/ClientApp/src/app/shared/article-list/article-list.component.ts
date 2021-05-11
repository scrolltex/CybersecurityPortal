import { Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Article, PaginatedViewModel } from '@app/models';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent {
  @Input() articles?: PaginatedViewModel<Article>;

  @Output() pageChange = new EventEmitter<number>();

  _trackByFn: TrackByFunction<Article> = (index, item) => item.id;

  _onPageChange(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex);
  }
}
