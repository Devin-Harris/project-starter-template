import { CommonModule } from '@angular/common';
import { Component, Inject, forwardRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
   MAT_DIALOG_DATA,
   MatDialogModule,
   MatDialogRef,
} from '@angular/material/dialog';
import { DialogComponent } from '../dialog.component';
import {
   ConfirmationDialogData,
   ConfirmationDialogType,
} from './models/confirmation-dialog.config';

@Component({
   imports: [
      CommonModule,
      MatDialogModule,
      MatButtonModule,
      forwardRef(() => DialogComponent),
   ],
   selector: 'pal-confirmation-dialog',
   standalone: true,
   templateUrl: './confirmation-dialog.component.html',
   styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
   dialogTypes = ConfirmationDialogType;

   get primaryActionBtnText(): string {
      if (this.data.dialogType === ConfirmationDialogType.YesNo) {
         return 'Yes';
      }
      return 'Ok';
   }
   get secondaryActionBtnText(): string {
      if (this.data.dialogType === ConfirmationDialogType.YesNo) {
         return 'No';
      }
      return '';
   }

   constructor(
      @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
      private dialogRef: MatDialogRef<ConfirmationDialogComponent>
   ) {}

   onPrimaryActionClick() {
      if (this.data.dialogType === ConfirmationDialogType.YesNo) {
         this.onYesClick();
      } else {
         this.onOkClick();
      }
   }

   onNoClick(): void {
      this.dialogRef.close(false);
   }

   private onOkClick(): void {
      this.dialogRef.close(true);
   }

   private onYesClick(): void {
      this.dialogRef.close(true);
   }
}
