import { IObjectKeys } from "./interfaces";

export function trackById(index: number, item: IObjectKeys) {
    return item._id;
}

export function trackByKey(index: number, item: IObjectKeys) {
    return item.key;
}

export function trackByIndex(index: number, item: IObjectKeys) {
    return index;
}

export function orderKeyValue(akv: any, bkv: any) {
    return 0;
}

export function track(key: string) {
    return function trackIng(index: number, item: IObjectKeys) {
        return item[key];
    }
}