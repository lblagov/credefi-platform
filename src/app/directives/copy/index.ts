import { Directive, HostListener, Input, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WINDOW } from 'src/app/modules/window';

@Directive({
    selector: '[copy]',
    providers: [MatSnackBar],
    standalone: true
})

export class CopyDirective {

    @Input('copy') message!: string;
    MatSnackBar = inject(MatSnackBar);
    window: Window = inject(WINDOW);

    constructor(
    ) { }

    @HostListener('click') async onClick() {
        try {
            await this.window.navigator.clipboard.writeText(this.message);
            this.openSnackBar();
        } catch (err) {
            console.error('Failed to copy: ', err);
        }

    }

    openSnackBar() {
        this.MatSnackBar.open('Address is copied in  clipboard', 'OK', {
            duration: 3000
        });

    }

}