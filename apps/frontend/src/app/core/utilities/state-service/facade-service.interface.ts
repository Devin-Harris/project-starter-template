import { inject } from '@angular/core';
import { Action, Store } from '@ngrx/store';

export interface FacadeService {
  dispatch(action: Action, source: string | null): void;
}

export class FacadeServiceBase implements FacadeService {
  protected store = inject(Store);

  dispatch(action: Action, source: string | null = null): void {
    this.store.dispatch({ ...action, source });
  }
}
