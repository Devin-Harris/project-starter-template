import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from './dailog.service';

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  selector: 'pal-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dialog.component.scss'],
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  /**
   * Optional.
   * Denotes whether to override the default close method.
   */
  @Input() useCloseOverride: boolean = false;

  /**
   * Optional.
   * Hides the X close button.
   */
  @Input() hideClose = false;

  /**
   * Optional.
   * When true, the spinner overlay is displayed.
   */
  @Input() isLoading = false;

  /**
   * Optional.
   * When true, the contents scrolling is handled by the child.
   */
  @Input() overrideContentScroll = false;

  /**
   * Optional.
   * The text to display for the primary action button. The button appears in
   * the primary material button styling and carries the type attribute of "submit".
   * As such, you can submit a form without listening for the primaryActionClick
   * event. Allows HTML content.
   */
  @Input() primaryActionBtnText!: string;

  /**
   * Optional.
   * When true, the primary action button is disabled.
   */
  @Input() primaryActionButtonDisabled: boolean = false;

  /**
   * Optional.
   * The text to display for the secondary action button. The button displays in
   * a material secondary button styling and is of type "button". If no text is
   * specified, the button does not display. When using this button, the
   * secondaryActionClick event will be emitted. This button appears to the
   * left of the primary action button. Allows HTML content.
   */
  @Input() secondaryActionBtnText!: string;

  /**
   * Optional.
   * When true, the secondary action button is disabled.
   */
  @Input() secondaryActionButtonDisabled: boolean = false;

  /**
   * Optional.
   * The text to display for the tertiary action button. The button displays in
   * a material secondary button styling and is of type "button". If no text is
   * specified, the button does not display. When using this button, the
   * tertiaryActionClick event will be emitted. This button appears to the
   * left of the secondary action button. Allows HTML content.
   */
  @Input() tertiaryActionBtnText!: string;

  /**
   * Optional.
   * When true, the tertiary action button is disabled.
   */
  @Input() tertiaryActionButtonDisabled: boolean = false;

  /**
   * Optional.
   * The title text to display for the dialog. Allows HTML content.
   */
  @Input() titleText!: string;

  /**
   * Optional when using form submit.
   * Emitted upon clicking the primary action button.
   */
  @Output() primaryActionClick = new EventEmitter<void>();

  /**
   * Required only when using the secondary action button.
   * Emitted upon clicking the secondary action button.
   */
  @Output() secondaryActionClick = new EventEmitter<void>();

  /**
   * Required only when using the tertiary action button.
   * Emitted upon clicking the tertiary action button.
   */
  @Output() tertiaryActionClick = new EventEmitter<void>();

  /**
   * Optional.
   * Emitted upon closing when the useCloseOverride is true
   */
  @Output() closeOverride = new EventEmitter<void>();

  constructor(private dialogService: DialogService) {}

  /**
   * Closes the dialog.
   * The dialog must be opened via the LcsDialogService's open()
   * or openFormComponent() functions. The dialog reference is
   * established in those functions and is used to control how
   * the dialog is closed.
   */
  onCloseClick(): void {
    if (!this.useCloseOverride) {
      this.dialogService.close();
    } else {
      this.closeOverride.emit();
    }
  }

  /**
   * Emits void when the primary action button is clicked.
   */
  onPrimaryActionBtnClick(): void {
    this.primaryActionClick.emit();
  }

  /**
   * Emits void when the secondary action button is clicked.
   */
  onSecondaryActionBtnClick(): void {
    this.secondaryActionClick.emit();
  }

  /**
   * Emits void when the tertiary action button is clicked.
   */
  onTertiaryActionBtnClick(): void {
    this.tertiaryActionClick.emit();
  }
}
