import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[type="number"]',
    standalone: true
})

export class InputNumberDirective {

    readonly dot = '.';
    readonly minus = '-';

    readonly allowed = ['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', '-', '.', 'Enter', 'Tab']
    readonly numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    @Input() positive = false;
    @Input() integer = false

    constructor(private element: ElementRef) { }

    ngOnInit() {
        if (this.positive) {
            this.element.nativeElement.min = '0';
        }
    }

    @HostListener('keydown', ['$event']) onClick(event: KeyboardEvent) {

        const charCode = event.key;
        const value = this.element.nativeElement.value;

        if (this.integer) {
            if (event.key == this.dot) {
                return false;
            }
        }

        if (this.positive) {
            if (event.key == this.minus) {
                return false;
            }
        }

        if (charCode == this.minus && value?.length > 0) {
            return false;
        }

        if (charCode == this.dot && value?.includes(this.dot)) {
            return false;
        }

        if (this.allowed.includes(charCode)) {
            return true;
        }

        const num = Number(charCode);

        if (this.numbers.includes(num)) {
            return true;
        }

        if (value < 0) {


            return false;

        }
    }

    @HostListener('keyup', ['$event']) keyup(event: KeyboardEvent) {
        if (this.positive && this.element.nativeElement.value < 0) {
            this.element.nativeElement.value = 0;
        }
    }

    @HostListener('change', ['$event']) change(event: Event) {
        if (this.positive && this.element.nativeElement.value < 0) {
            this.element.nativeElement.value = 0;
        }
    }


}