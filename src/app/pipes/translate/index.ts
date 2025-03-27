import { Pipe, PipeTransform } from '@angular/core';
import { LanguageProvider } from 'src/app/providers';

@Pipe({
    name: 'translate',
    standalone: true
})

export class TranslatePipes implements PipeTransform {

    private language: string;

    constructor(
        private languageProvider: LanguageProvider
    ) {
        this.language = this.languageProvider.language;
    }

    transform(value: { [key: string]: string } | any, key?: string, hideMissingText?: boolean): any {
        if (key && value instanceof Object) {

            const v = value[`${key}${this.language}`];

            if (v == null) {
                return hideMissingText ? '' : `Missing translation ${this.language}`;
            }

            if (v != null && v.length == 0 && v.constructor.name == 'String') {
                return hideMissingText ? '' : `Missing translation ${this.language}`;
            }

            return v;
        }

        return value;
    }

}