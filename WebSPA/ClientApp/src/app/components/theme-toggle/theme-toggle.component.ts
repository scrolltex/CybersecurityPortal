import { Component } from '@angular/core';
import { ThemeService } from '@app/services';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button mat-icon-button (click)="themeService.toggleDarkMode()" matTooltip="Тема">
      <mat-icon>{{ themeService.isDarkMode ? 'dark_mode' : 'light_mode' }}</mat-icon>
    </button>
  `,
  styles: [],
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
}
