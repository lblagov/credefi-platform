import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageProvider } from 'src/app/providers';
import { IObjectKeys } from '../helpers/interfaces';
import { templateParser } from '../helpers/template';

@Injectable({
  providedIn: 'root'
})

export class LanguageResolver implements Resolve<any> {

  constructor(
    private lang: LanguageProvider
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IObjectKeys> {
    const { languagePath } = route.data;
    const laguage: string = this.lang.language;
    return this.lang.getTranslation(`${languagePath}/${laguage}.json`).pipe(map(({ params = {}, functions = {} }) => {

      const translations: IObjectKeys = new Translations(params);

      for (let key in functions) {
        const text = functions[key];
        translations[key] = (values: IObjectKeys) => {
          return templateParser(text, values)
        }
      }

      return translations
    }));
  }

}

class Translations {

  constructor(translations: IObjectKeys) {
    return new Proxy(translations, {
      get: (obj, key: string) => {
        const value = obj[key];
        if (value == null) {
          return 'Missing translation'
        }
        return obj[key];
      }
    });
  }

}
