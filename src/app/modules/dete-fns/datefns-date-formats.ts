import { MatDateFormats } from '@angular/material/core';

export const DATEFNS_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'P',
  },
  display: {
    dateInput: 'P',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};