import { Directive, HostListener, Input } from '@angular/core';

enum InputTypes {
    text = 'text',
    password = 'password'
}

@Directive({
    selector: '[password]',
    standalone: true
})

export class PasswordDirective {

    @Input() password: HTMLInputElement;

    constructor() { }

    @HostListener('click', ['$event.target']) onClick($event) {
        switch (this.password.type) {
            case (InputTypes.text): {
                this.password.type = InputTypes.password;
                break;
            }
            case (InputTypes.password): {
                this.password.type = InputTypes.text;
                break;
            }
        }
    }


}