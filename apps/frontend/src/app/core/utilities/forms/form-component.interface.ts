import { UntypedFormGroup, NgForm } from '@angular/forms';

export interface FormComponent {
   form: UntypedFormGroup | NgForm;
}

export function instanceOfFormComponent(object: any): object is FormComponent {
   return object?.form && (object.form instanceof UntypedFormGroup || object.form instanceof NgForm);
}
