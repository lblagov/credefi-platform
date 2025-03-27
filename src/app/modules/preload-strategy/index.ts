import { PreloadingStrategy, Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PreloadStrategy implements PreloadingStrategy {

    preload(route: Route, load: () => Observable<any>): Observable<any> {
        if (route.data && route.data['preload']) {
            return load();
        } else {
            return EMPTY;
        }
    }

} 