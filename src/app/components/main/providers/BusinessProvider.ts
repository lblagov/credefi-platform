import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { API } from 'src/environments/environment';

@Injectable()

export class BusinessProvider {

  constructor(
    private Http: HttpClient,
  ) { }

  post(data: IObjectKeys): Observable<{ result: IObjectKeys, error?: IObjectKeys | string, errors?: IObjectKeys }> {
    return <Observable<{ result: IObjectKeys, error: IObjectKeys, errors?: IObjectKeys }>>this.Http
      .post(`${API}/add_business/?wallet=${data.wallet}&company=${data.company}&representive=${data.representive}&phone=${data.phone}&email=${data.email}`, null)
  }

}
