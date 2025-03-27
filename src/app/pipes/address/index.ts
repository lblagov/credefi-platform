import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'address',
    standalone: true
})

export class AddressPipe implements PipeTransform {

    constructor() { }

    transform(data: string): string {
        if(!data){
            return '';
        }
        const first = data?.slice(0, 5);
        const last = data?.slice(data.length - 4, data.length);
        return `${first}...${last}`;
    }
}
