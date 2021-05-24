import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isString, intersection } from 'lodash-es';

import { APP_CONFIG, AppConfig } from '../config';
import { SignInModel, RegisterModel, JwtData, ChangePasswordModel, ChangeEmailModel } from '../models';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessToken$: BehaviorSubject<string | null>;
  userData$: Observable<JwtData | null>;

  private readonly baseUrl: string;

  constructor(@Inject(APP_CONFIG) config: AppConfig, private http: HttpClient, private jwtService: JwtHelperService) {
    this.baseUrl = `${config.apiUrl}/api/auth`;

    const savedToken = AuthService.getToken();
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
          role: data.role,
        };
      })
    );
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  auth(model: SignInModel): Observable<string> {
    return this.http.post<{ access_token: string }>(this.baseUrl, model).pipe(
      map((m) => m.access_token),
      tap((token) => {
        localStorage.setItem(TOKEN_KEY, token);
        this.accessToken$.next(token);
      })
    );
  }

  /**
   * Проверяет есть ли роль у текущего пользователя
   *
   * @param roles роль или список ролей
   */
  hasRole(roles: string | string[]): boolean {
    if (roles == null || roles.length === 0) {
      return false;
    }

    const payload = this.jwtService.decodeToken() as JwtData | null;
    if (payload?.role == null) {
      return false;
    }

    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    const userRoles = isString(payload.role) ? [payload.role] : payload.role;
    if (userRoles.some((x) => x === 'admin')) {
      return true;
    }

    const u = intersection(userRoles, roles);
    return u.length > 0;
  }

  register(model: RegisterModel): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, model);
  }

  changePassword(model: ChangePasswordModel): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/changePassword`, model);
  }

  changeEmail(model: ChangeEmailModel): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/changeEmail`, model);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.accessToken$.next(null);
  }
}
