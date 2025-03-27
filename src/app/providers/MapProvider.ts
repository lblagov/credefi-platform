import { Injectable, EventEmitter } from '@angular/core';
import { IObjectKeys } from '../helpers/interfaces';

@Injectable({
  providedIn: 'root'
})

export class MapProvider {

  static readonly USER = 'user';
  static readonly TOKEN = 'token';
  static readonly LANGUAGE = 'language';
  static readonly METAMASK = 'metamask';

  private map = new Map<string, any>();
  private change: IObjectKeys = {};

  constructor() { }

  keys() {
    return this.map.keys();
  }

  get(key: string): any {
    return this.map.get(key);
  }

  set(key: string, value: any): Map<string, any> {

    let data = this.map.set(key, value);

    if (this.change[key] instanceof EventEmitter) {
      this.change[key].emit(this.map.get(key));
    }

    return data;

  }

  toJson(): any {
    const obj: IObjectKeys = {};
    Array.from(this.keys())
      .forEach(key => {
        obj[key] = this.get(key);
      });
    return obj;
  }

  initialize(obj: any): void {
    Object.keys(obj)
      .forEach(key => {
        this.set(key, obj[key]);
      });
  }

  setSubsription(name: string) {

    if (this.change[name]) {
      return this.change[name];
    }

    this.change[name] = new EventEmitter();
    return this.change[name];
  }

}
