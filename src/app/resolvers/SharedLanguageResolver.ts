import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageProvider } from 'src/app/providers';
import { IObjectKeys } from '../helpers/interfaces';
import { templateParser } from '../helpers/template';

@Injectable({
  providedIn: 'root'
})

export class SharedLanguageResolver implements Resolve<any> {

  constructor(
    private lang: LanguageProvider
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IObjectKeys> {
    const { sharedLanguagePaths } = route.data;
    const laguage: string = this.lang.language;
    const join = [];
    const sharedLanguages: IObjectKeys = {};

    for (const key in sharedLanguagePaths) {
      const languagePath = sharedLanguagePaths[key];
      join.push(this.lang.getTranslation(`${languagePath}/${laguage}.json`).pipe(map(({ params = {}, functions = {} }) => {

        const translations: IObjectKeys = new Translations(params);

        for (let key in functions) {
          const text = functions[key];
          translations[key] = (values: IObjectKeys) => {
            return templateParser(text, values)
          }
        }

        sharedLanguages[key] = translations;

      })));
    }

    return forkJoin(join).pipe(map(() => {
      return sharedLanguages;
    }));

  }

}

class Translations {

  constructor(translations: IObjectKeys) {
    return new Proxy(translations, {
      get: (obj, key: string) => {
        const value = obj[key];
        if (value == null) {
          return 'Missing text'
        }
        return obj[key];
      }
    });
  }

}
