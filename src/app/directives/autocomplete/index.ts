import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[autocomplete]',
    standalone: true
})

export class AutoCompleteDirective {

    constructor(
        private ElementRef: ElementRef
    ) { }

    ngAfterViewInit() {
        this.ElementRef.nativeElement.removeAttribute('id');
        this.ElementRef.nativeElement.autocomplete = 'nope';
    }

}