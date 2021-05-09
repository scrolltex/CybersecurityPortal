import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { APP_CONFIG, AppConfig } from '../config';
import { SignInModel, RegisterModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessToken$: BehaviorSubject<string | null>;
  userData$: Observable<{ nameid: string; email: string } | null>;

  private readonly baseUrl: string;

  constructor(@Inject(APP_CONFIG) config: AppConfig, private http: HttpClient, private jwtService: JwtHelperService) {
    this.baseUrl = `${config.apiUrl}/api/auth`;

    const savedToken = localStorage.getItem('access_token');
    this.accessToken$ = new BehaviorSubject<string | null>(savedToken);
    this.userData$ = this.accessToken$.pipe(
      map((token) => {
        if (token == null) {
          return null;
        }
        const data = jwtService.decodeToken(token);
        return {
          nameid: data.nameid,
          email: data.email,
        };
      })
    );
  }

  auth(model: SignInModel): Observable<string> {
    return this.http.post<{ access_token: string }>(this.baseUrl, model).pipe(
      map((m) => m.access_token),
      tap((token) => {
        localStorage.setItem('access_token', token);
        this.accessToken$.next(token);
      })
    );
  }

  register(model: RegisterModel): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, model);
  }
}
