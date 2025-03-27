import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { ApiProvider } from 'src/app/providers';


@Injectable()

export class AccountProvider {

  private path: string = 'account'
  private paths: string = 'accounts'

  constructor(
    private ApiProvider: ApiProvider
  ) { }

  post(data: IObjectKeys) {
    return this.ApiProvider.post(this.path, data);
  }

  getAllUserAccounts() {
    return <Observable<IObjectKeys[]>>this.ApiProvider.get(`${this.paths}/user/all`).pipe(map(({ result, error }) => {
      if (result) {
        return result;
      }
      return [];
    }));
  }

  delete(accountId: string) {
    return this.ApiProvider.delete(`${this.path}/${accountId}`);
  }

}
