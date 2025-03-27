export { Environment } from './config';

export enum WalletTypes{
    metamask = 'metamask',
    credi = 'credi',
    gemwallet = 'gemwallet',
    xumm = 'xumm',
    okx = 'okx',
    walletconnect = 'walletconnect',
    crosswallet = 'crosswallet'
}

export enum CurrencyTypes{
    eth = 'eth',
    credi = 'credi',
    usdt = 'usdt',
    xrpl = 'xrpl',
    usd = 'usd',
    eur = 'eur'
}

export enum DepositTypes{
  bank = 'bank',
  crypto = 'crypto',
}

export const UserRoles = {
    user: {
        id: 1,
        key: 'user'
    },
    admin: {
        id: 2,
        key: 'admin'
    }
};

export const Languages = [
    {
        icon: 'uk.png',
        shortName: 'EN',
        name: 'English',
        key: 'EN'
    }
];

export const FileTypes = {
    image: {
        key: 'image',
        suportedTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp'],
        maxSize: 8 * 1048576
    },
    pdf: {
        key: 'pdf',
        suportedTypes: ['application/pdf'],
        maxSize: 8 * 1048576
    }
};


export const Mercuryo = {
    key: 'mercuryo',
    host: 'https://exchange.mercuryo.io/',
    data: {
        widget_id: '2ce492bc-be4c-4a3f-be3b-0667c0019c8f',
        type: 'buy',
        currency: 'BUSD',
        fiat_currency: 'USD',
        fix_amount: 'true',
        fix_currency: 'true',
        fix_fiat_amount: 'true',
        fix_fiat_currency: 'true',
        lang: 'en'
    }
}

export const MobileWidth = 870;
export const MainMobileWidth = 950;

