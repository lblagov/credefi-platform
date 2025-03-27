import { Directive, Output, EventEmitter, OnInit } from '@angular/core';

@Directive({
    selector: '[load]'
})

export class LoadDirective implements OnInit {

    @Output('load') private load = new EventEmitter

    constructor() { }

    ngOnInit() {
        this.load.emit();
    }

}