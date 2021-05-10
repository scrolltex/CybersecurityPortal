import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ErrorDialogData {
  message: string;
  details?: any;
}

@Component({
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
})
export class ErrorDialogComponent {
  showDetails = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorDialogData) {}

  get formatedDetails(): string | undefined {
    const details = this.data.details;
    if (details == null) {
      return undefined;
    }
    return typeof details === 'object' ? JSON.stringify(details, null, 2) : details;
  }
}
