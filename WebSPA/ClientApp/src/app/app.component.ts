import { Component } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ThemeService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public loader: LoadingBarService, themeService: ThemeService) {}
}
