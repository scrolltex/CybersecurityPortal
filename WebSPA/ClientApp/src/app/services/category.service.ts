import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig, APP_CONFIG } from '@app/core/config';
import { Category } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl: string;
  constructor(@Inject(APP_CONFIG) config: AppConfig, private http: HttpClient) {
    this.baseUrl = `${config.apiUrl}/api/categories`;
  }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }
}
