import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

// Localization
import localeRu from '@angular/common/locales/ru';
import localeRuExtra from '@angular/common/locales/extra/ru';

import { AppConfigService } from './config/app-config.service';
import { JwtModule } from '@auth0/angular-jwt';

// Register locales
registerLocaleData(localeRu, 'ru', localeRuExtra);

// Load application config at startup
export function loadConfigFactory(configService: AppConfigService): () => Promise<any> {
  return () => configService.loadConfig().toPromise();
}

@NgModule({
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('access_token'),
        allowedDomains: ['localhost:5001'],
      },
    }),
  ],
  exports: [HttpClientModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigFactory,
      deps: [AppConfigService],
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
