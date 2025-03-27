import { InjectionToken } from '@angular/core';
import { Map, tileLayer, LatLng, Marker, icon } from 'leaflet';

import { MapModules } from '.';

export const MAP = new InjectionToken<any>('map', {
  providedIn: MapModules,
  factory: () => {
    try {

      const iconRetinaUrl = 'marker-icon-2x.png';
      const iconUrl = 'marker-icon.png';
      const shadowUrl = 'marker-shadow.png';
      const iconDefault = icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });

      Marker.prototype.options.icon = iconDefault;

      return {
        Map, tileLayer, LatLng, Marker
      };
    } catch (err) {
      throw new Error('Leaflet not found!');
    }
  }
});