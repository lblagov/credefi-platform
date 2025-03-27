import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hextodec',
    standalone: true
})

export class HexToDecPipe implements PipeTransform {

    constructor() { }

    transform(data: string): string {
        return `${Number(data)}`;
    }
}
