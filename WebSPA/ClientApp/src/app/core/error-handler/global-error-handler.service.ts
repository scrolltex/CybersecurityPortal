import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorDialogComponent, ErrorDialogData } from './error-dialog.component';
import { ProblemDetails } from './problem-details.model';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private ngZone: NgZone) {}

  async handleError(error: Error | HttpErrorResponse): Promise<void> {
    if (error instanceof HttpErrorResponse) {
      // Server error
      if (error.status === 403) {
        this.showErrorNotification('Доступ запрещен');
      } else {
        let errorMessage = '';
        let details: string | object | undefined;

        if (error.status >= 400 && error.status < 600) {
          if (error.error == null) {
            errorMessage = `Статус код: ${error.status}\n` + error.message;
          } else if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else {
            let err = error.error;
            if (err instanceof Blob) {
              err = await err.arrayBuffer();
            }

            let problemDetails: ProblemDetails;
            if (err instanceof ArrayBuffer) {
              const decoder = new TextDecoder();
              problemDetails = JSON.parse(decoder.decode(err)) as ProblemDetails;
            } else {
              problemDetails = err;
            }

            errorMessage = problemDetails.detail ?? '';
            details = problemDetails;
          }
        } else {
          errorMessage = `Неизвестная ошибка: \n` + error.message;
        }

        this.showErrorDialog(errorMessage, details);
      }
    } else {
      // Client error
      this.showErrorDialog(error.message, error.stack);
    }

    console.error(error);
  }

  private showErrorDialog(message: string, details?: string | object): void {
    const dialog = this.injector.get(MatDialog);
    this.ngZone.run(() => {
      dialog.open<ErrorDialogComponent, ErrorDialogData>(ErrorDialogComponent, {
        minWidth: 400,
        data: { message, details },
      });
    });
  }

  private showErrorNotification(message: string): void {
    const snackBar = this.injector.get(MatSnackBar);
    this.ngZone.run(() => {
      snackBar.open(message);
    });
  }
}
