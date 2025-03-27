import { Injectable, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

import { ApiProvider, MapProvider } from 'src/app/providers';
import { LOCAL_STORAGE } from 'src/app/modules/local-storage';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { BasicUser } from 'src/app/model';

@Injectable()

export class AuthenticationProvider {

  private path = 'user';

  constructor(
    private MapProvider: MapProvider,
    private ApiProvider: ApiProvider,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) {}

  postActivation(token: string) {
    return this.ApiProvider.post(`${this.path}/activation/${token}`).pipe(map(({ result, error }) => {

      if (result) {

        const { user, token } = result;

        this.MapProvider.set(MapProvider.USER, new BasicUser(user));
        this.MapProvider.set(MapProvider.TOKEN, token);
        this.localStorage.setItem(MapProvider.TOKEN, token);

      }

      return {
        result,
        error
      }

    }));

  }

  facebookAuth(accessToken: string): Promise<{ result: IObjectKeys, errors?: IObjectKeys }> {
    return firstValueFrom(this.ApiProvider.post(`${this.path}/authenticate/facebook`, { accessToken })).then(({ result, errors }) => {

      if (errors) {
        return Promise.reject(errors);
      }

      if (result) {
        const { user, token } = result;
        this.MapProvider.set(MapProvider.USER, new BasicUser(user));
        this.MapProvider.set(MapProvider.TOKEN, token);
        this.localStorage.setItem(MapProvider.TOKEN, token);
      }

      return { result, errors };

    });
  }

  googleAuth(accessToken: string): Promise<{ result: IObjectKeys, errors?: IObjectKeys }> {
    return firstValueFrom(this.ApiProvider.post(`${this.path}/authenticate/google`, { accessToken })).then(({ result, errors }) => {

      if (errors) {
        return Promise.reject(errors);
      }

      if (result) {
        const { user, token } = result;
        this.MapProvider.set(MapProvider.USER, new BasicUser(user));
        this.MapProvider.set(MapProvider.TOKEN, token);
        this.localStorage.setItem(MapProvider.TOKEN, token);
      }

      return { result, errors };

    });
  }


}
