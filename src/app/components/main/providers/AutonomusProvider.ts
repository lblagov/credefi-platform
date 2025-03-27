import { Injectable } from '@angular/core';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { ApiProvider } from 'src/app/providers';


@Injectable()

export class AutonomusProvider {

  private path: string = 'autonomus'

  constructor(
    private ApiProvider: ApiProvider
  ) { }

  post(data: IObjectKeys) {
    return this.ApiProvider.post(this.path, data);
  }

}
