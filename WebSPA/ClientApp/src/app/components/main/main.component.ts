import { Component } from '@angular/core';

import { AuthService } from '@app/core/services';
import { CategoryService } from '@app/services';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  categories$ = this.categoryService.getAll();

  constructor(public authService: AuthService, public categoryService: CategoryService) {}
}
