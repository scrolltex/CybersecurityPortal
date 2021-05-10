import { Component, Inject } from '@angular/core';
import { LOCATION } from '@ng-web-apis/common';

import { AuthService } from '@app/core/services';
import { CategoryService } from '@app/services';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  categories$ = this.categoryService.getAll();

  constructor(
    public authService: AuthService,
    public categoryService: CategoryService,
    @Inject(LOCATION) private location: Location
  ) {}

  logout(): void {
    this.authService.logout();
    this.location.reload();
  }
}
