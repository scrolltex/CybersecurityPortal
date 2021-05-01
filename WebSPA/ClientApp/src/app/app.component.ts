import { Component, Inject } from '@angular/core';

import { AppConfig, APP_CONFIG } from './core/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'WebSPA';

  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}
}
