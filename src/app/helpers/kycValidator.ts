import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateKYC(amount: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const a = control.value;

        if (a > amount) {
            return {
                kyc: {
                  amount
                }
            }
        }

        return null;
    }
}