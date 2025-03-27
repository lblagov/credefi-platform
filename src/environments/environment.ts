import { IObjectKeys } from "src/app/helpers/interfaces";

export const environment = {
  production: false
};

export const CHAIN = {
  ethereum: {
    key: 'ethereum',
    lpstake: false,
    name: "ETH",
    currency: "ETH",
    networkName: "Ethereum",
    NetworkLink: 'https://eth-mainnet.g.alchemy.com/v2/TjVCHn3U8hVXkYEKV_KNMHqSnLl43ojf',
    USDT_ADDRESS: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    CREDI_ADDRESS: '0xaE6e307c3Fe9E922E5674DBD7F830Ed49c014c6B',
    EARN_ADDRESS: '0xe62dc987aa18798bafcf26cb5aa3a4f18650af38',
    EARN_BUSINESS_ADDRESS: '0x35C2258DE87Da0DF328bC17985f1dE73C0829B47', //0x60882618240acc52e64af3576638d4b2ae861d73 OLD
    XCREDI_ADDRESS: '0x3bbfb303842dd4a76da4c927be644e9cf3170afd',
    STAKING_ADDRESS: '0x36c2c64b6f55d00d48e999519a560ffc4de8c77e',
    LP_ADDRESS: "0xAC9fbdbE486F8023606b932a747BC476011B5071",
    OWNER: "0x01521db54f9311cd63ed1710057b3c519b7e935e",
    SWAP_ADDRESS: '0xf6dd14e06caa095c63e998d524b95a174adede0b',
    UTILITY_ADDRESS: '0x4651a2236bd33fda4259f568f3b3509e773f5472',
    xcrediStake: false,
    Scan: 'https://etherscan.io/',
    Metamask: {
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    },
    EXPLORER: 'https://etherscan.io/tx',
    ALCHEMY_URL: 'https://eth-mainnet.g.alchemy.com/v2/TjVCHn3U8hVXkYEKV_KNMHqSnLl43ojf',
    WALLET_CONNECT: {
      projectId: '31e3491b0b103891162df19a770067b1',
      relayUrl: "wss://relay.walletconnect.com",
      metadata: {
        name: 'credefi',
        description: 'INNOVATIVELENDING FORREAL-WORLDIMPACT',
        url: window.location.host,
        icons: ['https://www.credefi.finance/img/group-48098950@2x.png']
      }
    },
    bonds: {
      one: {
        ERC1155: "0x26F755d720B60BA2e46e6F02a60b6996dDcE04C2",
        swap: "0x4e95D677F44B49467Cdf92da27a023A733745f62"
      }
    },
  },
  binance: {
    key: 'binance',
    lpstake: true,
    name: "BSC",
    currency: "BNB",
    networkName: "Binance",
    NetworkLink:
    'https://bsc-dataseed2.defibit.io',
    USDT_ADDRESS: '0x55d398326f99059ff775485246999027b3197955',
    CREDI_ADDRESS: '0x2235e79086dd23135119366da45851c741874e5b',
    EARN_ADDRESS: '0x74bebd8b8192cdbdebfeae0056671aed4fd82903', //0x60882618240acc52e64af3576638d4b2ae861d73 OLD
    EARN_BUSINESS_ADDRESS: '0x361a40504b04242038f601921cb3c650b02842c1', //0x60882618240acc52e64af3576638d4b2ae861d73 OLD
    XCREDI_ADDRESS: '0x1265DAdE08e13F1c6f9706287FBE39083dC5a4b4',
    STAKING_ADDRESS: '0x5D40f8c2d5AB063caBA8A9b2dD36a22CF3953331',
    LP_ADDRESS: '0x56D6A1d81fC627d8c307fa181B928EA280Ea653d',
    OWNER: '0x01521db54f9311cd63ed1710057b3c519b7e935e',
    SWAP_ADDRESS: '0x62fd0385fd779d9fe96a988d5d39ed2718265dae',
    UTILITY_ADDRESS: '0xD1E407Ee1c581Bc5Ba1C17148828E385FD836fAc', //0xe62dc987aa18798bafcf26cb5aa3a4f18650af38 OLD
    xcrediStake: true,
    XCREDI_STAKING_ADDRESS: '0xda3386aae8601ff26787c1869c797edad24e4601',
    Scan: 'https://bscscan.com/',
    Metamask: {
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x38' }],
    },
    EXPLORER: 'https://bscscan.com/tx',
    ALCHEMY_URL: 'https://bnb-mainnet.g.alchemy.com/v2/TjVCHn3U8hVXkYEKV_KNMHqSnLl43ojf',

    WALLET_CONNECT: {
      projectId: '31e3491b0b103891162df19a770067b1',
      relayUrl: 'wss://relay.walletconnect.com',
      metadata: {
        name: 'credefi',
        description: 'INNOVATIVELENDING FORREAL-WORLDIMPACT',
        url: window.location.host,
        icons: ['https://www.credefi.finance/img/group-48098950@2x.png'],
      },
    },
    bonds: {
      one: {
        ERC1155: "0x26F755d720B60BA2e46e6F02a60b6996dDcE04C2",
        swap: "0x4e95D677F44B49467Cdf92da27a023A733745f62"
      }
    }
  },
}

export const API = 'https://credefi.finance/api'

export const DemoUser: IObjectKeys = {
  enable: false,
  createdAt: '2021-03-14T13:58:26.455Z',
  email: 'demo@credefi.finance',
  gaEnabled: false,
  kycActivation: true,
  role: 'user',
  type: 1,
  updatedAt: '2023-09-29T21:53:47.229Z'
};

export const DefaultChain = CHAIN[localStorage.getItem("network")] ? localStorage.getItem("network") : "ethereum";
export const STAKING_PERIOD = 180n;
