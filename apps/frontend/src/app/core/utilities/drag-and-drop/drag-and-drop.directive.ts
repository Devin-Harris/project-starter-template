import {
   ComponentRef,
   Directive,
   EventEmitter,
   Input,
   Output,
   Renderer2,
   ViewContainerRef,
   effect,
   inject,
} from '@angular/core';
import { DragAndDropService } from './drag-and-drop.service';
import { DropzoneComponent } from './drop-zone/drop-zone.component';
import { FileUploadModel } from './file-upload.model';

@Directive({
  selector: '[fileDragDrop]',
  standalone: true,
  providers: [DragAndDropService],
})
export class DragAndDropDirective {
  @Output() droppedFiles = new EventEmitter<FileUploadModel[]>();

  @Output() draggingChange = new EventEmitter<boolean>();

  @Input() message: string | null = null;

  @Input() hideDropzoneOverlay: boolean = false;

  dragAndDropService = inject(DragAndDropService);

  $droppedFile = effect(() => {
    this.droppedFiles.emit(this.dragAndDropService.$droppedFiles());
  });

  $dragging = effect(() => {
    const dragging = this.dragAndDropService.$dragging();
    if (dragging !== this.currentDragging) {
      this.draggingChange.emit(dragging);
      this.currentDragging = dragging;
      if (!this.hideDropzoneOverlay) {
        this.setDropzoneInputs();
      }
    }
  });

  private currentDragging = false;

  private dropzoneInstance: ComponentRef<DropzoneComponent> | null = null;

  constructor(
    public viewContainerRef: ViewContainerRef,
    public renderer: Renderer2
  ) {
    this.dragAndDropService.setHostElement(
      viewContainerRef.element.nativeElement
    );
    if (!this.hideDropzoneOverlay) {
      this.createDropzoneComponent();
    }
  }

  private createDropzoneComponent(): void {
    const element = this.viewContainerRef.element.nativeElement;
    this.dropzoneInstance =
      this.viewContainerRef.createComponent(DropzoneComponent);
    this.renderer.appendChild(
      element,
      this.dropzoneInstance?.location.nativeElement
    );
    this.setDropzoneInputs();

    requestAnimationFrame(() => {
      const { position } = getComputedStyle(element);
      if (position === 'static') {
        element.style.position = 'relative';
      }
    });
  }

  private setDropzoneInputs(): void {
    this.dropzoneInstance?.setInput('dragging', this.currentDragging);
    if (this.message) {
      this.dropzoneInstance?.setInput('message', this.message);
    }
  }
}
