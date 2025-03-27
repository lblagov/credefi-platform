import { UntypedFormControl } from '@angular/forms';
import { IObjectKeys } from './interfaces';

export function strongPasswordValidator(c: UntypedFormControl) {
    let hasNumber = /\d/.test(c.value);
    let hasUpper = /[A-Z]/.test(c.value);
    let hasLower = /[a-z]/.test(c.value);
    let char = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/.test(c.value);
    const errors: IObjectKeys = {};

    if (!hasNumber) {
        errors.number = true
    }

    if (!hasUpper) {
        errors.upper = true
    }

    if (!hasLower) {
        errors.lower = true
    }

    if (!char) {
        errors.char = true
    }

    const length = Object.keys(errors).length ;

    if(length <= 1){
        return null;
    }

    if (Object.keys(errors).length > 0) {
        return errors;
    }

    return null;

}