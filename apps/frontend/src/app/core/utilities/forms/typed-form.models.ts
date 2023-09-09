import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Array<any>
    ?
        | FormArray<FormControl<Unpacked<T[K]>>>
        | FormArray<never>
        | FormControl<T[K]>
    : T[K] extends Record<any, any>
    ? FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};

export type WithStatus<T> = T & {
  valid: boolean;
  dirty: boolean;
  dirtyFields: (keyof T)[];
};
