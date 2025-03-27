import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, Observable, shareReplay } from 'rxjs';

import { ApiProvider } from './ApiProvider';
import { Errors } from '../helpers/errors';
import { MapProvider } from './MapProvider';
import { LOCAL_STORAGE } from '../modules/local-storage';
import { WINDOW } from '../modules/window';
import { Languages } from 'src/globals';
import { IObjectKeys } from '../helpers/interfaces';

@Injectable({
    providedIn: 'root'
})

export class LanguageProvider {

    private _errors!: { [key: string]: Function };
    private activePromise!: Promise<IObjectKeys> | null;

    private _language = 'EN';
    private readonly key = 'LANGUAGE';
    private readonly defaultLanguage = 'EN';
    private readonly path = 'language';
    private readonly errorsPath = "errors";

    private _languages = Languages;

    private cache: {
        [key: string]: Observable<IObjectKeys>
    } = {};

    constructor(
        private ApiProvider: ApiProvider,
        private MapProvider: MapProvider,
        @Inject(WINDOW) private window: Window,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(LOCAL_STORAGE) private localStorage: Storage,
    ) { }

    async init({ language = this.defaultLanguage }) {

        this._language = language
        this.MapProvider.set(MapProvider.LANGUAGE, this._language);
    }

    async setLanguage(language: string, refresh = true) {
        this._language = language;

        if (refresh && isPlatformBrowser(this.platformId)) {
            this.localStorage.setItem(this.key, language);
            this.window.location.reload();
        }

    }

    get language() {
        return this._language;
    }

    get languages() {
        return this._languages;
    }

    get errors(): Promise<{ [key: string]: Function }> {

        if (this._errors) {
            return new Promise((resolve, reject) => {
                return resolve(this._errors);
            });
        }

        if (this.activePromise) {
            return this.activePromise;
        }

        this.activePromise = firstValueFrom(this.getTranslation(`${this.errorsPath}/${this._language}.json`)).then((data) => {
            this.activePromise = null;
            this._errors = Errors(data);
            return this._errors;

        });

        return this.activePromise;

    }

    getTranslation(path: string) {
        if (!this.cache[path]) {
            this.cache[path] = this.ApiProvider.get(`${this.path}?path=${path}`).pipe(shareReplay(1));
        }
        return this.cache[path];
    }

    sort(country: IObjectKeys) {
        const { language } = country;
        const index = this.getIndex(language);
        if (index > -1) {
            const item = this._languages[index];
            this._languages.splice(index, 1);
            this._languages.unshift(item);
        }
    }

    private getIndex(language: string) {
        for (let i = 0; i < this._languages.length; i++) {
            if (this._languages[i].key == language) {
                return i;
            }
        }
        return -1;
    }

    private checkLanguage(language: string) {
        const languages = Languages;
        for (let lang of languages) {
            if (lang.key == language) {
                return language;
            }
        }
        return this.defaultLanguage;
    }

    clearCache() {
        this.cache = {};
    }

}