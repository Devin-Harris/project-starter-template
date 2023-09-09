import { Signal } from '@angular/core';
import { Selector } from '@ngrx/store';
import { FacadeService, FacadeServiceBase } from './facade-service.interface';

interface FacadeServiceFromSelector<T> extends FacadeService {
   $data: Signal<T>;
}

type FacadeServiceFromSelectorConstructor<T> = new (
   ...args: any[]
) => FacadeServiceFromSelectorBase<T>;

class FacadeServiceFromSelectorBase<T = any>
   extends FacadeServiceBase
   implements FacadeServiceFromSelector<T>
{
   protected selector: Selector<any, T>;

   readonly $data: Signal<T>;

   constructor(selector: Selector<any, T>) {
      super();
      this.selector = selector;
      this.$data = this.store.selectSignal(this.selector);
   }
}

export function FacadeServiceFromSelector<T>(
   selector: Selector<any, T>
): FacadeServiceFromSelectorConstructor<T> {
   return class extends FacadeServiceFromSelectorBase<T> {
      constructor() {
         super(selector);
      }
   };
}
