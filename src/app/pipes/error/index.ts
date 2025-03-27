import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { LanguageProvider } from 'src/app/providers';

@Pipe({
    name: 'error',
    pure: false,
    standalone: true
})

export class ErrorPipe implements PipeTransform {

    errors!: { [key: string]: Function };

    constructor(private lang: LanguageProvider) {
        this.lang.errors.then((errors) => {
            this.errors = errors;
        }).catch((e) => {
            console.log(e);
        })
    }

    transform(value: AbstractControl | null) {
        const errors = [];

        if (this.errors != null && value instanceof AbstractControl) {
            for (let key in value.errors) {
                const error = this.errors[key](value);

                if (error instanceof Array) {
                    let e = error.reduce((a, b) => {
                        a += ` ${b}`;
                        return a;
                    }, '');
                    errors.push(e);
                } else {
                    errors.push(this.errors[key](value));
                }

            }
        }

        return errors;
    }
}