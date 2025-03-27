import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Environment } from '../../globals/config';
import { MapProvider } from './MapProvider';
import { IObjectKeys } from '../helpers/interfaces';

@Injectable()

export class ApiProvider {

    constructor(
        private HttpClient: HttpClient,
        private MapProvider: MapProvider,
    ) { }

    get(path: string): Observable<{ result: IObjectKeys, error: IObjectKeys, errors?: IObjectKeys, params?: IObjectKeys, functions?: IObjectKeys }> {
        return <Observable<{ result: IObjectKeys, error: IObjectKeys, errors?: IObjectKeys, params?: IObjectKeys, functions?: IObjectKeys }>>this.HttpClient
            .get(`${Environment.api_url}/api/${Environment.api_version}/${path}`, { withCredentials: true, headers: this.getHaders() })
    }

    post(path: string, body?: IObjectKeys): Observable<{ result: IObjectKeys, error?: IObjectKeys | string, errors?: IObjectKeys }> {
        return <Observable<{ result: IObjectKeys, error: IObjectKeys, errors?: IObjectKeys }>>this.HttpClient
            .post(`${Environment.api_url}/api/${Environment.api_version}/${path}`, body, { withCredentials: true, headers: this.getHaders() })
    }

    put(path: string, body?: IObjectKeys): Observable<{ result: IObjectKeys, error?: IObjectKeys | string, errors?: IObjectKeys }> {
        return <Observable<{ result: IObjectKeys, error?: IObjectKeys | string, errors?: IObjectKeys }>>this.HttpClient
            .put(`${Environment.api_url}/api/${Environment.api_version}/${path}`, body, { withCredentials: true, headers: this.getHaders() })
    }

    patch(path: string, body?: IObjectKeys): Observable<{ result: IObjectKeys, error?: IObjectKeys | string, errors?: IObjectKeys }> {
        return <Observable<{ result: IObjectKeys, error?: IObjectKeys | string, errors?: IObjectKeys }>>this.HttpClient
            .patch(`${Environment.api_url}/api/${Environment.api_version}/${path}`, body, { withCredentials: true, headers: this.getHaders() })
    }

    delete(path: string): Observable<{ result: IObjectKeys, error?: IObjectKeys | string, errors?: IObjectKeys }> {
        return <Observable<{ result: IObjectKeys, error?: IObjectKeys | string, errors?: IObjectKeys }>>this.HttpClient
            .delete(`${Environment.api_url}/api/${Environment.api_version}/${path}`, { withCredentials: true, headers: this.getHaders() })
    }

    private getHaders() {
        const token = this.MapProvider.get(MapProvider.TOKEN);
        const language = this.MapProvider.get(MapProvider.LANGUAGE);
        let headers = new HttpHeaders();

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        if (language) {
            headers = headers.set('language', language);
        }

        return headers;

    }


}
