import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig, APP_CONFIG } from '@app/core/config';
import { Article, CreateArticleModel, PaginatedViewModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly baseUrl: string;
  constructor(@Inject(APP_CONFIG) config: AppConfig, private http: HttpClient) {
    this.baseUrl = `${config.apiUrl}/api/articles`;
  }

  getAll(pageSize = 10, pageIndex = 0, categoryId?: string): Observable<PaginatedViewModel<Article>> {
    let params = new HttpParams();
    params = params.set('pageSize', pageSize.toString());
    params = params.set('pageIndex', pageIndex.toString());
    if (categoryId != null) {
      params = params.set('categoryId', categoryId.toString());
    }

    return this.http.get<PaginatedViewModel<Article>>(this.baseUrl, { params });
  }

  search(searchRequest: string, pageSize = 10, pageIndex = 0): Observable<PaginatedViewModel<Article>> {
    let params = new HttpParams();
    params = params.set('searchRequest', searchRequest);
    params = params.set('pageSize', pageSize.toString());
    params = params.set('pageIndex', pageIndex.toString());

    return this.http.get<PaginatedViewModel<Article>>(`${this.baseUrl}/search`, { params });
  }

  getById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${id}`);
  }

  create(model: CreateArticleModel): Observable<Article> {
    return this.http.post<Article>(this.baseUrl, model);
  }

  update(model: Article): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${model.id}`, model);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  toggleBookmark(articleId: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/${articleId}/bookmark`, {});
  }

  toggleLike(articleId: string): Observable<{ state: boolean; count: number }> {
    return this.http.post<{ state: boolean; count: number }>(`${this.baseUrl}/${articleId}/like`, {});
  }
}
