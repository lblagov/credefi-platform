import { FormControl } from '@angular/forms';

export function validateEmail(c: FormControl) {
    if (c.value == null || c.value.length == 0) {
      return null;
    }
    let EMAIL_REGEXP = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,24})$/;
    return EMAIL_REGEXP.test(c.value) ? null :
      {
        email: true
      }
  }