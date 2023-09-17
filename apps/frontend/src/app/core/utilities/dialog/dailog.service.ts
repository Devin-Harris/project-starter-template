import { ESCAPE } from '@angular/cdk/keycodes';
import { ComponentType } from '@angular/cdk/portal';
import { Inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { FormComponent } from '../forms/form-component.interface';
import { Stack } from '../stack/stack';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {
  ConfirmationDialogData,
  ConfirmationDialogType,
} from './confirmation-dialog/models/confirmation-dialog.config';
import { DialogSize } from './enumerations/dialog-size.enum';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogRefStack = new Stack<MatDialogRef<any, any>>();

  private rootDialogPanelClass = 'dialog-container';

  constructor(@Inject(MatDialog) private matDialog: MatDialog) {}

  /**
   * Closes the dialog. If the dialog contains a dirty form, a save prompt
   * is raised when an attempt is made to close the dialog.
   */
  close(confirmClose = true): void {
    const dialogRef = this.dialogRefStack.peek();
    if (!dialogRef) {
      this.closeFormComponent();
    } else if (confirmClose) {
      this.confirmClose(dialogRef);
    } else {
      dialogRef.close();
    }
  }

  /**
   * Closes all currently open dialogs.
   */
  closeFormComponent(): void {
    this.matDialog.closeAll();
  }

  /**
   * Closes all currently open dialogs.
   */
  confirm(
    config?: MatDialogConfig<ConfirmationDialogData>
  ): MatDialogRef<ConfirmationDialogComponent, boolean> {
    if (!config?.data) {
      throw new Error('A confirmation message is required.');
    }
    config.role = 'alertdialog';
    return this.open(ConfirmationDialogComponent, config);
  }

  /**
   * Displays a confirmation dialog regarding unsaved changes.
   * @returns The MatDialogRef of the confirmation dialog.
   */
  confirmLostChanges(): MatDialogRef<ConfirmationDialogComponent, boolean> {
    return this.confirm({
      data: {
        header: 'Are You Sure?',
        message: 'Unsaved changes will be lost.',
        dialogType: ConfirmationDialogType.YesNo,
      },
      panelClass: [DialogSize.Medium],
    });
  }

  /**
   * Finds and returns an open dialog reference based upon the dialog ID.
   * @param dialogId The ID of the dialog.
   * @returns The dialog reference if a match to the dialogId is found;
   * otherwise, undefined.
   */
  getDialogById(dialogId: string): MatDialogRef<any, any> | undefined {
    return this.matDialog.getDialogById(dialogId);
  }

  /**
   * Opens a dialog containing the specified component and returns the dialog
   * reference of that dialog.
   * @param componentRef The component type.
   * @param config The dialog configuration.
   * @returns The dialog reference of the newly opened dialog.
   */
  open<T, D = any>(
    componentRef: ComponentType<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, any> {
    if (config) {
      const panelClass = config.panelClass
        ? Array.isArray(config.panelClass)
          ? config.panelClass
          : [config.panelClass]
        : [];
      if (!panelClass.includes(this.rootDialogPanelClass)) {
        panelClass.push(this.rootDialogPanelClass);
      }
      config.panelClass = panelClass;
    }

    const dialogRef = this.matDialog.open(componentRef, config);
    this.dialogRefStack.push(dialogRef);
    this.listenToDialogRefClose(dialogRef);
    return dialogRef;
  }

  /**
   * Opens a dialog containing the specified form component and returns the dialog
   * reference of that dialog. If the dialog contains a dirty form, a save prompt
   * is raised when an attempt is made to close the dialog.
   * @param componentRef The form component type.
   * @param config The dialog configuration.
   * @returns The dialog reference of the newly opened dialog.
   */
  openFormComponent<T extends FormComponent, D = any>(
    componentRef: ComponentType<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, any> {
    config = {
      ...config,
      disableClose:
        config?.disableClose !== undefined ? config.disableClose : true,
    };

    const dialogRef = this.open(componentRef, config);

    if (config.disableClose) {
      this.listenToKeyPress(dialogRef);
      this.listenToBeforeUnload(dialogRef);
    }

    return dialogRef;
  }

  /**
   * Displays a save prompt if a dirty form is detected; otherwise, closes
   * the dialog.
   * @param dialogRef The dialog reference.
   */
  private confirmClose(dialogRef: MatDialogRef<any, any>): void {
    if ((dialogRef.componentInstance as FormComponent)?.form?.dirty) {
      this.openConfirmationWithChangesDialog(dialogRef);
    } else {
      dialogRef.close();
    }
  }

  /**
   * Subscribes to the dialog's key-down events. If the Esc key is detected,
   * the dialog close routine is performed.
   * @param dialogRef The dialog reference.
   */
  private listenToKeyPress(dialogRef: MatDialogRef<any, any>): void {
    dialogRef
      .keydownEvents()
      .pipe(
        // eslint-disable-next-line import/no-deprecated
        filter((e) => e.keyCode === ESCAPE),
        takeUntil(dialogRef.afterClosed())
      )
      .subscribe(() => {
        this.confirmClose(dialogRef);
      });
  }

  /**
   * Subscribes to the window's unload event (window close, tab close, url
   * location change). If detected, the dialog close routine is performed.
   * @param dialogRef The dialog reference.
   */
  private listenToBeforeUnload(dialogRef: MatDialogRef<any, any>): void {
    const showUnsavedAlert = (event: BeforeUnloadEvent) => {
      if ((dialogRef.componentInstance as FormComponent).form.dirty) {
        // The contents of the string are not important, returnValue just needs to be assigned a string.
        event.returnValue = ' ';
      }
    };

    window.addEventListener('beforeunload', showUnsavedAlert);
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(() => {
        window.removeEventListener('beforeunload', showUnsavedAlert);
      });
  }

  /**
   * Subscribes to the given dialogRef's close event.
   * If detected, the dialogRef is removed from the stack.
   * @param dialogRef The dialog reference.
   */
  private listenToDialogRefClose(dialogRef: MatDialogRef<any, any>): void {
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(() => {
        this.dialogRefStack.pop();
      });
  }

  /**
   * Opens the close confirmation window, notifying the user of unsaved changes.
   * A positive confirmation closes the dialog, losing all unsaved changes. A
   * negative confirmation cancels the dialog close request.
   * @param dialogRef The dialog reference.
   */
  private openConfirmationWithChangesDialog(
    dialogRef: MatDialogRef<any, any>
  ): void {
    const confirmationDialogRef = this.confirmLostChanges();

    confirmationDialogRef
      .afterClosed()
      .pipe(takeUntil(dialogRef.afterClosed()))
      .subscribe((confirmed) => {
        if (confirmed) {
          dialogRef.close();
        }
        return EMPTY;
      });
  }
}
