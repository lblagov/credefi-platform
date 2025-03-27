import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
    name: 'safeHTML',
    standalone: true
})

export class SafeHTMLPipe implements PipeTransform {

    constructor(private DomSanitizer: DomSanitizer){ }

    transform(value: string): any {
        if(value == null){
            return '';
        }
        return this.DomSanitizer.bypassSecurityTrustHtml(value);
    }
}