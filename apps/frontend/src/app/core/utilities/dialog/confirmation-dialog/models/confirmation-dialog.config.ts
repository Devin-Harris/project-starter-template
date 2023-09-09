import { MatDialogConfig } from '@angular/material/dialog';
import { DialogSize } from '@core/utilities/dialog/enumerations/dialog-size.enum';

export enum ConfirmationDialogType {
  Ok,
  YesNo,
}

export type ConfirmationDialogConfig =
  MatDialogConfig<ConfirmationDialogData> & {
    size: DialogSize;
    data: ConfirmationDialogData;
  };

export interface ConfirmationDialogData {
  message: string;
  header: string;
  dialogType?: ConfirmationDialogType;
}
