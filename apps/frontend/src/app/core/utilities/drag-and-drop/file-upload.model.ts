import { SafeUrl } from '@angular/platform-browser';
export interface FileUploadModel {
   fileId: number | null;
   file: File | null;
   fileUrl: string | SafeUrl | null;
   fileName: string | null;
}
