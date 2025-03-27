import { UntypedFormControl } from '@angular/forms';
import { IObjectKeys } from './interfaces';
import { templateParser } from './template';

export function Errors(template: IObjectKeys) {
  return {
    number: function (control: UntypedFormControl, name: string) {
      return template.params.number;
    },
    upper: function (control: UntypedFormControl, name: string) {
      return template.params.upper;
    },
    lower: function (control: UntypedFormControl, name: string) {
      return template.params.lower;
    },
    required: function (control: UntypedFormControl, name: string) {
      return template.params.required;
    },
    char: function (control: UntypedFormControl, name: string) {
      return template.params.char;
    },
    email: function (control: UntypedFormControl, name: string) {
      return template.params.email;
    },
    maxlength: function (control: UntypedFormControl, name: string) {
      return templateParser(template.functions.maxlength, { maxlength: control?.errors?.maxlength.requiredLength });
    },
    max: function (control: UntypedFormControl, name: string) {
      return templateParser(template.functions.max, { max: control?.errors?.max.max });
    },
    min: function (control: UntypedFormControl, name: string) {
      return templateParser(template.functions.min, { min: control?.errors?.min.min });
    },
    minlength: function (control: UntypedFormControl, name: string) {
      return templateParser(template.functions.minlength, { minlength: control?.errors?.minlength.requiredLength });
    },
    passwordMismatch: function (control: UntypedFormControl, name: string) {
      return template.params.passwordMismatch;
    },
    incorrect: function (control: UntypedFormControl, name: string) {
      return control?.errors?.incorrect;
    },
    phone: function (control: UntypedFormControl, name: string) {
      return template.params.phone;
    },
    walletPassword: function (control: UntypedFormControl, name: string) {
      return template.params.walletPassword;
    },
    gasError: function (control: UntypedFormControl, name: string) {
      return template.params.gasError;
    },
    keyStore: function (control: UntypedFormControl, name: string) {
      return template.params.keyStore;
    },
    vatnumber: function (control: UntypedFormControl, name: string) {
      return template.params.vatnumber;
    },
    maxLendAmount: function (control: UntypedFormControl, name: string) {
      return templateParser(template.functions.maxLendAmount, { amount: control?.errors?.maxLendAmount.maxAmount });
    },
    pattern: function (control: UntypedFormControl, name: string) {
      return template.params.pattern;
    },
    kyc: function (control: UntypedFormControl, name: string) {
      return template.params.kyc;
    },
  }
}