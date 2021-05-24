import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

// Localization
import localeRu from '@angular/common/locales/ru';
import localeRuExtra from '@angular/common/locales/extra/ru';

import { AppConfigService } from './config/app-config.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services';
import { ErrorHandlerModule } from './error-handler';

// Register locales
registerLocaleData(localeRu, 'ru', localeRuExtra);

// Load application config at startup
export function loadConfigFactory(configService: AppConfigService): () => Promise<any> {
  return () => configService.loadConfig().toPromise();
}

export function checkTokenFactory(jwtService: JwtHelperService): () => Promise<any> {
  return () => {
    if (jwtService.isTokenExpired()) {
      localStorage.removeItem('access_token');
    }

    return Promise.resolve();
  };
}

@NgModule({
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: () => AuthService.getToken(),
        allowedDomains: ['localhost:5001'],
      },
    }),
    ErrorHandlerModule,
  ],
  exports: [HttpClientModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigFactory,
      deps: [AppConfigService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: checkTokenFactory,
      deps: [JwtHelperService],
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
