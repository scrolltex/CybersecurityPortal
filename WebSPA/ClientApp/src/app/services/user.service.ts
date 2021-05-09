import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig, APP_CONFIG } from '@app/core/config';
import { User } from '../models';

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
}
