import { InjectionToken } from '@angular/core';
import { Locale } from 'date-fns';

export const DATEFNS_LOCALES = new InjectionToken<Locale[]>(
  'DATEFNS_LOCALES'
);