import { inject, InjectionToken } from '@angular/core';

import { AppConfig } from './app-config';
import { AppConfigService } from './app-config.service';

export const APP_CONFIG = new InjectionToken<AppConfig>('Application configuration loaded at startup from backend.', {
  factory: () => inject(AppConfigService).config,
});
