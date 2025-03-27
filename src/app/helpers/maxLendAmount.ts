import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxLendAmount(amount: number): ValidatorFn {
    return (formGroup: AbstractControl | UntypedFormGroup): ValidationErrors | null => {

        const a = formGroup.value;

        if (a > amount) {
            return {
                maxLendAmount: {
                    maxAmount: amount
                }
            }
        }

        return null;
    }
}