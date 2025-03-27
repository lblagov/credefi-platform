import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DATEFNS_DATE_FORMATS } from './datefns-date-formats';
import { DateFnsDateAdapter, DATEFNS_DATE_ADAPTER_OPTIONS } from './datefns-date-adapter';
import { DATEFNS_LOCALES } from './datefns-locales';

@NgModule({
    providers: [
        {
            provide: DateAdapter,
            useClass: DateFnsDateAdapter,
            deps: [MAT_DATE_LOCALE, DATEFNS_LOCALES, DATEFNS_DATE_ADAPTER_OPTIONS],
        },
    ],
})

export class DateFnsDateModule { }

@NgModule({
    imports: [DateFnsDateModule],
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: DATEFNS_DATE_FORMATS },
        { provide: DATEFNS_LOCALES, useValue: [] },
    ],
})

export class MatDateFnsDateModule { }
