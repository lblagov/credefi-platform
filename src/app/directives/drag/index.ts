import { Directive, HostListener, ElementRef, Inject } from '@angular/core';
import { WINDOW } from 'src/app/modules/window';

@Directive({
    selector: '[drag]',
    standalone: true
})

export class DragDirective {

    target!: EventTarget | null;

    readonly threshold = 10;

    x = 0;
    left = 0;
    drag = false
    listener = false
    move = false;

    constructor(
        private element: ElementRef,
        @Inject(WINDOW) private window: Window,
    ) { }

    @HostListener('mousedown', ['$event']) mousedown(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.x = event.pageX;
        this.left = this.element.nativeElement.scrollLeft;
        this.drag = true;
        this.target = event.target;
        return false
    }

    @HostListener('mouseup', ['$event']) mouseup(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.drag = false;
        this.listener = false;
        this.move = false;
        return false
    }

    @HostListener('mousemove', ['$event']) mousemove(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (this.drag) {
            if (Math.abs(event.pageX - this.x) >= this.threshold) {
                this.move = true;
            }
            if (this.move) {
                this.element.nativeElement.scrollLeft = this.left - event.pageX + this.x;
                this.setListener();
            }
        }
        return false
    }

    @HostListener('mouseleave', ['$event']) mouseleave(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.drag = false;
        this.listener = false;
        this.move = false;
        return false

    }

    setListener() {
        if (!this.listener) {
            this.listener = true;
            this.window.addEventListener('click', captureClick, { capture: true, passive: true })
        }
    }

}

function captureClick(event: MouseEvent) {
    event.stopPropagation();
    this.window.removeEventListener('click', captureClick, true);
}