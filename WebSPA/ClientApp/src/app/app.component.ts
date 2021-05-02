import { Component } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { CategoryService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  categories$ = this.categoryService.getAll();
  constructor(public loader: LoadingBarService, public categoryService: CategoryService) {}
}
