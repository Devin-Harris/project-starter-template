import {
  Injectable,
  NgZone,
  OnDestroy,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent, merge } from 'rxjs';
import { FileUploadModel } from './file-upload.model';

export enum DragAndDropEvent {
  Drag = 'drag',
  Dragstart = 'dragstart',
  Dragend = 'dragend',
  Dragleave = 'dragleave',
  Dragenter = 'dragenter',
  Dragover = 'dragover',
  Drop = 'drop',
}

export interface FileUploadModelWithObjectUrl extends FileUploadModel {
  objectUrl: string;
}

@Injectable()
export class DragAndDropService implements OnDestroy {
  $droppedFiles = signal<FileUploadModel[]>([]);

  $dragging = signal(false);

  private readonly domSanitizer = inject(DomSanitizer);

  private readonly ngZone = inject(NgZone);

  private hostElement: HTMLElement = document.body;

  private files: FileUploadModelWithObjectUrl[] = [];

  private readonly eventsToProcess = [
    DragAndDropEvent.Dragend,
    DragAndDropEvent.Dragenter,
    DragAndDropEvent.Drop,
    DragAndDropEvent.Dragleave,
  ];

  readonly $events = toSignal(
    merge(
      ...this.eventsToProcess.map((e) =>
        fromEvent<DragEvent>(this.hostElement, e)
      ),
      // Events that we need to preventDefault and stopProgagation for so dropping still works
      fromEvent<DragEvent>(this.hostElement, DragAndDropEvent.Drag),
      fromEvent<DragEvent>(this.hostElement, DragAndDropEvent.Dragstart),
      fromEvent<DragEvent>(this.hostElement, DragAndDropEvent.Dragover)
    )
  );

  private lastDragEnter: number = Date.now();

  revokeObjectUrls(): void {
    this.files.forEach((f) => {
      URL.revokeObjectURL(f.objectUrl);
    });
    this.files = [];
  }

  setHostElement(element: HTMLElement): void {
    this.hostElement = element;
  }

  ngOnDestroy(): void {
    this.revokeObjectUrls();
  }

  private readonly eventEffect = effect(
    () => {
      this.ngZone.runOutsideAngular(() => {
        const event = this.$events();
        if (!event) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();

        if (!this.eventsToProcess.some((e) => event.type === e)) {
          return;
        }
        this.processEvent(event);
      });
    },
    { allowSignalWrites: true }
  );

  private processEvent(event: DragEvent) {
    const eventOnHostElement = event
      .composedPath()
      .some((e) => e === this.hostElement);

    this.setDraggingState(event, eventOnHostElement);

    if (eventOnHostElement && event.type === DragAndDropEvent.Drop) {
      let files: File[] | null = null;
      const dataTransfer = event.dataTransfer;
      if (dataTransfer && dataTransfer.files) {
        files = Array.from(dataTransfer.files);
      }
      if (files && files.length) {
        const fileUploads = files.map((file) => {
          const objectUrl = URL.createObjectURL(file);
          return {
            fileId: null,
            fileName: file.name,
            fileUrl: this.domSanitizer.bypassSecurityTrustUrl(objectUrl),
            file,
            objectUrl,
          };
        });
        this.files.push(...fileUploads);
        this.$droppedFiles.set(fileUploads);
      }
    }
  }

  private setDraggingState(
    event: DragEvent,
    eventOnHostElement: boolean
  ): void {
    if (event.type === DragAndDropEvent.Dragenter) {
      this.lastDragEnter = Date.now();
      if (this.$dragging() !== eventOnHostElement) {
        this.$dragging.set(eventOnHostElement);
      }
    }

    if (
      event.type === DragAndDropEvent.Dragend ||
      event.type === DragAndDropEvent.Drop
    ) {
      this.$dragging.set(false);
    }

    if (event.type === DragAndDropEvent.Dragleave)
      if (Date.now() - this.lastDragEnter >= 10) {
        // Making sure last drag enter hasnt happened within the last 10 milliseconds.
        // Without this debounce the dropzone will flash in and out as drag enter and leaves registers is rapid succession
        this.$dragging.set(false);
      }
  }
}
