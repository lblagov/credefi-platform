import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollerComponent, VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY } from './component';

@NgModule({
    exports: [VirtualScrollerComponent],
    declarations: [VirtualScrollerComponent],
    imports: [CommonModule],
    providers: [
        {
            provide: 'virtual-scroller-default-options',
            useFactory: VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY
        }
    ]
})

export class VirtualScrollerModule { }