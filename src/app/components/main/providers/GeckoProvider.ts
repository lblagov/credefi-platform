import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IObjectKeys } from 'src/app/helpers/interfaces';

@Injectable()

export class GeckoProvider {

    api = `https://api.coingecko.com/api/v3/simple/price?ids=credefi,ethereum,binancecoin,ripple&vs_currencies=USD`;

    constructor(
        private HttpClient: HttpClient
    ) { }

    get(): Observable<IObjectKeys> {
        return <Observable<IObjectKeys>>this.HttpClient
            .get(this.api)
    }

}
