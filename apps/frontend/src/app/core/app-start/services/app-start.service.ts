import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationStart } from '../state/app-start.actions';

@Injectable({
  providedIn: 'root',
})
export class AppStartService {
  private readonly store = inject(Store);

  initialize() {
    this.store.dispatch(ApplicationStart.initialized());
  }
}
