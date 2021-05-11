import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig, APP_CONFIG } from '@app/core/config';
import { Article, PaginatedViewModel, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl: string;
  constructor(@Inject(APP_CONFIG) config: AppConfig, private http: HttpClient) {
    this.baseUrl = `${config.apiUrl}/api/users`;
  }

  getByUserName(userName: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userName}`);
  }

  getBookmarks(userName: string, pageSize = 10, pageIndex = 0): Observable<PaginatedViewModel<Article>> {
    let params = new HttpParams();
    params = params.set('pageSize', pageSize.toString());
    params = params.set('pageIndex', pageIndex.toString());

    return this.http.get<PaginatedViewModel<Article>>(`${this.baseUrl}/${userName}/bookmarks`, { params });
  }
}
