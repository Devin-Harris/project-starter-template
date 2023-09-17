import { Injectable, inject } from '@angular/core';
import { DialogService } from '@frontend/core/utilities/dialog/dailog.service';
import { DialogSize } from '@frontend/core/utilities/dialog/enumerations/dialog-size.enum';
import { HttpException } from '@nestjs/common';
import { EMPTY, Observable } from 'rxjs';
import { ErrorMessageComponent } from '../error-message.component';

@Injectable({ providedIn: 'root' })
export class ErrorMessageService {
  private readonly dialogService = inject(DialogService);

  private showErrorMessageDialogs = true;

  /**
   * Shows an error message to the user. Returns an observable that emits and completes when the user dismisses the error.
   * @param exception The exception to show.
   */
  openErrorDialog(exception: HttpException): Observable<void> {
    if (this.showErrorMessageDialogs) {
      const dialogRef = this.dialogService.open<
        ErrorMessageComponent,
        HttpException
      >(ErrorMessageComponent, {
        closeOnNavigation: true,
        data: exception,
        disableClose: true,
        panelClass: [DialogSize.Medium],
      });
      return dialogRef.afterClosed();
    }
    return EMPTY;
  }

  preventErrorMessageDialogDisplay(): void {
    this.showErrorMessageDialogs = false;
  }

  allowErrorMessageDialogDisplay(): void {
    this.showErrorMessageDialogs = true;
  }

  close() {
    this.dialogService.closeFormComponent();
  }
}
