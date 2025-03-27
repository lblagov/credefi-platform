import { Injectable } from '@angular/core';

import { ApiProvider } from 'src/app/providers/ApiProvider';
import { IObjectKeys } from '../../../../helpers/interfaces';

@Injectable()

export class XummProvider {

  private path = 'xumm';

  constructor(
    private ApiProvider: ApiProvider,
  ) { }

  request(data: IObjectKeys) {
    return this.ApiProvider.post(`${this.path}`, data);
  }

  get(uuid: string){
    return this.ApiProvider.get(`${this.path}/${uuid}`);
  }

}
