import { Pipe, PipeTransform } from '@angular/core';
import { IObjectKeys } from 'src/app/helpers/interfaces';

@Pipe({
    name: 'slug',
    standalone: true
})

export class SlugPipe implements PipeTransform {

    constructor() { }

    transform(name: string): any {

        let lowerCaseName = name.toLowerCase().replace(/[ –.%(),\"\'/:\\]/g, '-').replace(/-+/g, '-');
        let slugName = '';

        for (let i = 0; i < lowerCaseName.length; i++) {
            const l: string = lowerCaseName[i];
            slugName += letters[l] || lowerCaseName[i];
        }

        return slugName.replace(/[^a-zA-Z0-9 -]/g, '');
    }
}

export const letters: IObjectKeys = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'i',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'ts',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sht',
    'ъ': 'a',
    'ь': 'j',
    'ю': 'yu',
    'я': 'ya'
};