import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@app/shared';
import { ErrorDialogComponent } from './error-dialog.component';
import { GlobalErrorHandler } from './global-error-handler.service';

@NgModule({
  declarations: [ErrorDialogComponent],
  imports: [CommonModule, MaterialModule],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
})
export class ErrorHandlerModule {}
