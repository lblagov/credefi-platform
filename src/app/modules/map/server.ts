import { InjectionToken } from '@angular/core';
import { MapModules } from '.';

export const MAP = new InjectionToken<any>('map', {
    providedIn: MapModules,
    factory: () => {
        try {
            return {};
        } catch (err) {
            throw new Error('Leaflet not found!');
        }
    }
});