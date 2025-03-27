import { HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ErrorIntercept implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((response: HttpErrorResponse) => {
                    this.router.navigate(["/error"]);
                    return EMPTY;
                })
            );
    }

}