import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LOCATION } from '@ng-web-apis/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppConfig } from './app-config';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private _config: AppConfig | null = null;

  constructor(private http: HttpClient, @Inject(LOCATION) private location: Location) {}

  get config(): AppConfig {
    if (this._config == null) {
      throw new Error('Config must be loaded before accessing!');
    }
    return this._config;
  }

  loadConfig(): Observable<AppConfig> {
    return this.http
      .get<AppConfig>(`${this.location.origin}/api/configuration`)
      .pipe(tap((config) => (this._config = config)));
  }
}
