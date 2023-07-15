import { FormControl, ValidationErrors } from '@angular/forms';

export class BusinessValidators {
  static notEmpty(formControl: FormControl): ValidationErrors | null {
    if (formControl.value == null || formControl.value.trim().length === 0) {
      return { notEmpty: true };
    }
    return null;
  }
}
