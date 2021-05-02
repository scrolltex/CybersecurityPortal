import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, WINDOW } from '@ng-web-apis/common';

/** Ключ localStorage. */
const STORAGE_THEME_KEY = 'is_dark_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _currentTheme = false;

  get isDarkMode(): boolean {
    return this._currentTheme;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: Storage
  ) {
    const saved = this.localStorage.getItem(STORAGE_THEME_KEY);
    let isDark = false;

    if (saved == null) {
      isDark = this.window.matchMedia && this.window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = saved === 'true';
    }

    this.setDarkTheme(isDark);
  }

  /**
   * Устанавливает темную тему приложения.
   */
  setDarkTheme(isDark: boolean): void {
    this.localStorage.setItem(STORAGE_THEME_KEY, '' + isDark);

    this._currentTheme = isDark;
    this.updateTheme();
  }

  toggleDarkMode(): void {
    this.setDarkTheme(!this.isDarkMode);
  }

  private updateTheme(): void {
    let isDark = this._currentTheme;
    if (isDark == null) {
      isDark = this.window.matchMedia && this.window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.document.body.classList.toggle('dark-theme', isDark);
  }
}
