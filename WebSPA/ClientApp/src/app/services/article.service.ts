import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig, APP_CONFIG } from '@app/core/config';
import { Article, PaginatedViewModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly baseUrl: string;
  constructor(@Inject(APP_CONFIG) config: AppConfig, private http: HttpClient) {
    this.baseUrl = `${config.apiUrl}/api/articles`;
  }

  getAll(pageSize = 10, pageIndex = 0, categoryId?: number): Observable<PaginatedViewModel<Article>> {
    let params = new HttpParams();
    params = params.set('pageSize', pageSize.toString());
    params = params.set('pageIndex', pageIndex.toString());
    if (categoryId != null) {
      params = params.set('categoryId', categoryId.toString());
    }

    return this.http.get<PaginatedViewModel<Article>>(this.baseUrl, { params });
  }
}
