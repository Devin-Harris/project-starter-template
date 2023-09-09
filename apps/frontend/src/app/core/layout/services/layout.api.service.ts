import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class LayoutApiService {
   httpClient = inject(HttpClient);

   loadLayout(): Observable<{ expandMenu: boolean }> {
      return of({ expandMenu: true });
   }

   expandLayout(): Observable<any> {
      return of();
   }

   collapseLayout(): Observable<any> {
      return of();
   }
}
