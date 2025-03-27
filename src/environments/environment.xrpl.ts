import { CurrencyTypes } from "src/globals";

export const environment = {
  production: false
};

export const XRPL_API = 'wss://s.altnet.rippletest.net:51233';
export const EXPLORER = 'https://testnet.xrpl.org/transactions';

export const XRPL_TOKENS = [
  {
    name: 'XRP',
    address: 'XRP',
    issuer: 'XRP',
    type: CurrencyTypes.xrpl,
  },
  {
    name: 'GateHub EUR',
    issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    address: 'EUR',
    type: CurrencyTypes.eur,
  },
  // {
  //   name: 'GateHub USD',
  //   issuer: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
  //   address: 'USD',
  //   type: CurrencyTypes.usd,
  // },
  {
    name: 'RLUSD',
    issuer: 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De',
    address: 'RLUSD',
    type: CurrencyTypes.usd,
  }
];


export const CREDI_ADDESS = "rLWpBpRc8US9EsR6pn93UsSePKTv64Yd1f";
