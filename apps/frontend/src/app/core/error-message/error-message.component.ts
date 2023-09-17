import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DialogComponent } from '../utilities/dialog/dialog.component';
import { processErrorMessage } from './error-processor';
import { Exception } from './models/exception.model';
import { ErrorMessageService } from './services/error-message.service';

@Component({
  selector: 'pal-error-message',
  templateUrl: 'error-message.component.html',
  standalone: true,
  imports: [CommonModule, DialogComponent, MatButtonModule],
  providers: [MatDialog],
})
export class ErrorMessageComponent implements OnDestroy {
  userMessage: string;

  service = inject(ErrorMessageService);

  private $destroyed = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Exception) {
    this.userMessage = processErrorMessage(data);
  }

  ngOnDestroy() {
    this.$destroyed.next();
  }

  onOkClick() {
    this.service.close();
  }
}
