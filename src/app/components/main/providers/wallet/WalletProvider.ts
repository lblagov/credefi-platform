import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import Contract, { Contract as IContract } from 'web3-eth-contract';
import { ABI as USDT_ABI } from '../../../../../globals/abi-usdt';
import { ABI as CREDI_ABI } from '../../../../../globals/abi-credi';
import { ABI as EARN_ABI } from '../../../../../globals/abi-earn';
import { ABI as STAKING_ABI } from '../../../../../globals/abi-staking';
import { ABI as XCREDI_ABI } from '../../../../../globals/abi-xcredi';
import { ABI as LP_ABI } from '../../../../../globals/abi-xcredi';
import { ABI as SWAP_ABI } from '../../../../../globals/swap';
import { ABI as UTILITY_ABI } from '../../../../../globals/utility';
import { ABI as ERC1155_ABI } from '../../../../../globals/abi-erc1155';
import { ABI as BOND_ABI } from '../../../../../globals/abi-bond';
import { ABI as EARN_BUSINESS_ABI } from '../../../../../globals/abi-earn-business';

import {
  CHAIN,
  DefaultChain,
  STAKING_PERIOD,
} from 'src/environments/environment';
import { Web3, Address, ContractAbi } from 'web3';
import { IObjectKeys } from '../../../../helpers/interfaces';
import { WalletTypes } from 'src/globals';
import {
  IAuthClient,
  AuthClient,
  generateNonce,
} from '@walletconnect/auth-client';
import { SignClient } from '@walletconnect/sign-client';

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import {
  Config,
  PublicClient,
  WebSocketPublicClient,
  configureChains,
  createConfig,
} from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { FallbackTransport } from 'viem';
import { GeckoProvider } from '../GeckoProvider';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WalletProvider {
  web3!: Web3;
  gacko = inject(GeckoProvider);

  credi: IContract<ContractAbi> | any;
  xcredi!: IContract<ContractAbi> | any;

  usdt!: IContract<ContractAbi> | any;
  lp!: IContract<ContractAbi> | any;

  earning!: IContract<ContractAbi> | any;
  earning_business!: IContract<ContractAbi> | any;

  staking!: IContract<ContractAbi> | any;
  swap!: IContract<ContractAbi> | any;
  utility!: IContract<ContractAbi> | any;
  xcredi_staking!: IContract<ContractAbi> | any;

  erc1155!: IContract<ContractAbi> | any;
  bondOne!: IContract<ContractAbi> | any;

  authClient!: IAuthClient;
  signClient!: any;
  wagmiConfig!: Config<PublicClient<FallbackTransport>, WebSocketPublicClient>;
  ethereumClient: EthereumClient;

  wallet = signal<{
    type: WalletTypes;
    data?: IObjectKeys | null;
  }>(null);

  address: WritableSignal<Address | null> = signal<Address | null>(null);
  shortAddress = signal<null | string>(null);
  chain = signal(DefaultChain);

  constructor() {
    this.init();
  }

  init() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(CHAIN[this.chain()].NetworkLink)
    );
    this.usdt = new this.web3.eth.Contract(
      USDT_ABI,
      CHAIN[this.chain()].USDT_ADDRESS
    );
    this.lp = new this.web3.eth.Contract(
      LP_ABI,
      CHAIN[this.chain()].LP_ADDRESS
    );

    this.credi = new this.web3.eth.Contract(
      CREDI_ABI,
      CHAIN[this.chain()].CREDI_ADDRESS
    );
    this.xcredi = new this.web3.eth.Contract(
      XCREDI_ABI,
      CHAIN[this.chain()].XCREDI_ADDRESS
    );

    this.earning = new this.web3.eth.Contract(
      EARN_ABI,
      CHAIN[this.chain()].EARN_ADDRESS
    );

    this.earning_business = new this.web3.eth.Contract(
      EARN_BUSINESS_ABI,
      CHAIN[this.chain()].EARN_BUSINESS_ADDRESS
    );

    this.staking = new this.web3.eth.Contract(
      STAKING_ABI,
      CHAIN[this.chain()].STAKING_ADDRESS
    );

    this.xcredi_staking = new this.web3.eth.Contract(
      STAKING_ABI,
      CHAIN[this.chain()].XCREDI_STAKING_ADDRESS
    );

    this.swap = new this.web3.eth.Contract(
      SWAP_ABI,
      CHAIN[this.chain()].SWAP_ADDRESS
    );
    this.utility = new this.web3.eth.Contract(
      UTILITY_ABI,
      CHAIN[this.chain()].UTILITY_ADDRESS
    );

    this.erc1155 = new this.web3.eth.Contract(
      ERC1155_ABI,
      CHAIN[this.chain()].bonds.one.ERC1155
    );
    this.bondOne = new this.web3.eth.Contract(
      BOND_ABI,
      CHAIN[this.chain()].bonds.one.swap
    );
  }

  generateWagmi() {
    if (!this.wagmiConfig) {
      const chains = [mainnet, sepolia];
      const projectId = CHAIN[this.chain()].WALLET_CONNECT.projectId;
      const wConf = w3mConnectors({ projectId, chains });

      const { publicClient } = configureChains(chains, [
        w3mProvider({ projectId }),
      ]);
      this.wagmiConfig = createConfig({
        autoConnect: true,
        connectors: wConf,
        publicClient,
      });

      this.ethereumClient = new EthereumClient(this.wagmiConfig, chains);
    }
  }

  async walletConnect(callback: Function, reconnect = false) {
    if (!this.authClient) {
      this.authClient = await AuthClient.init(
        CHAIN[this.chain()].WALLET_CONNECT
      );
    }

    if (!this.signClient) {
      this.signClient = await SignClient.init(
        CHAIN[this.chain()].WALLET_CONNECT
      );
    }

    if (this.wagmiConfig?.data?.account && !reconnect) {
      const address = this.wagmiConfig.data.account;
      const first = address.slice(0, 5);
      const last = address.slice(address.length - 4, address.length);

      this.address.set(address);
      this.shortAddress.set(`${first}...${last}`);

      this.wallet.set({
        type: WalletTypes.walletconnect,
      });

      return false;
    } else {
      const unsubscribe = this.wagmiConfig.subscribe((data) => {
        if (data.status == 'connected') {
          const address = data.data.account;
          const first = address.slice(0, 5);
          const last = address.slice(address.length - 4, address.length);

          this.address.set(address);
          this.shortAddress.set(`${first}...${last}`);

          this.wallet.set({
            type: WalletTypes.walletconnect,
          });

          callback();
          unsubscribe();
        }
      });
    }

    const { uri } = await this.authClient.request({
      aud: window.location.href,
      domain: window.location.hostname.split('.').slice(-2).join('.'),
      chainId: 'eip155:1',
      type: 'eip4361',
      nonce: generateNonce(),
      statement: 'Credefi Auth',
    });

    return uri;
  }

  setWallet(wallet: IObjectKeys) {
    this.wallet.set({
      type: WalletTypes.credi,
      data: wallet,
    });

    const address = `0x${wallet.address}`;
    const first = address.slice(0, 5);
    const last = address.slice(address.length - 4, address.length);

    this.address.set(address);
    this.shortAddress.set(`${first}...${last}`);
  }

  async getTransactions(limit: number, page?: string, wallet?: string) {
    const params: IObjectKeys = {
      order: 'desc',
      maxCount: `0x${limit.toString(16)}`,
      fromBlock: '0x0',
      toBlock: 'latest',
      fromAddress: wallet ?? this.address(),
      category: ['external', 'internal', 'erc20'],
    };

    if (page) {
      params.pageKey = page;
    }

    const data = await fetch(CHAIN[this.chain()].ALCHEMY_URL, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 0,
        method: 'alchemy_getAssetTransfers',
        params,
      }),
    });
    return data.json();
  }

  async connectMetamask() {
    if ((window as any).ethereum) {
      try {
        document.cookie = `selectWallet=;expires=${new Date(
          0
        ).toUTCString()};path=/`;

        await (window as any).ethereum.request(CHAIN[this.chain()].Metamask);
        const addr = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        this.address.set(addr?.[0]);

        const first = this.address().slice(0, 5);
        const last = this.address().slice(
          this.address().length - 4,
          this.address().length
        );
        this.shortAddress.set(`${first}...${last}`);
        this.wallet.set({
          type: WalletTypes.metamask,
        });
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  async connectOKX() {
    if ((window as any).okxwallet) {
      try {
        document.cookie = `selectWallet=;expires=${new Date(
          0
        ).toUTCString()};path=/`;

        await (window as any).okxwallet.request(CHAIN[this.chain()].Metamask);
        const addr = await (window as any).okxwallet.request({
          method: 'eth_requestAccounts',
        });
        this.address.set(addr?.[0]);

        const first = this.address().slice(0, 5);
        const last = this.address().slice(
          this.address().length - 4,
          this.address().length
        );
        this.shortAddress.set(`${first}...${last}`);
        this.wallet.set({
          type: WalletTypes.metamask,
        });

        const data = await this.web3.eth.getTransactionCount(this.address());
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  get parsedAddress() {
    if (this.address() == null) {
      return;
    }
    const first = this.address().slice(0, 5);
    const last = this.address().slice(
      this.address().length - 4,
      this.address().length
    );
    return `${first}...${last}`;
  }

  async getContractBalance(contract: IObjectKeys): Promise<number> {
    if (this.address()) {
      const address = this.address();
      const contractInstance: IContract<ContractAbi> | any =
        new this.web3.eth.Contract(contract.ABI, contract.address);

      return contractInstance.methods
        .decimals()
        .call()
        .then((decimal: any) => {
          return contractInstance.methods
            .balanceOf(address)
            .call({ from: address })
            .then((tokens: number) => {
              const amount = Number(tokens) / 10 ** Number(decimal);
              return amount;
            });
        });
    }
  }

  async getBalance() {
    if (this.address() == null) {
      return 0;
    }
    const value = await this.web3.eth.getBalance(this.address());
    return Number(this.web3.utils.fromWei(value, 'ether'));
  }

  async getUsdtAllowance() {
    return this.usdt.methods
      .allowance(this.address(), CHAIN[this.chain()].EARN_ADDRESS)
      .call();
  }

  getEarnContractParams() {
    const methods: IObjectKeys = this.earning.methods;
    return Promise.all([
      this.earning.methods.params().call(),
      this.earning.methods
        .getPercentSize()
        .call()
        .then((data) => {
          return methods.getPercent((data as any) - 1n).call();
        }),
      this.earning.methods
        .getPeriodSize()
        .call()
        .then((data) => {
          const p = [];
          for (let i = 0n; i < (data as any); i++) {
            p.push(
              methods
                .getPeriod(i)
                .call()
                .then((period) => {
                  return {
                    period,
                    index: i,
                  };
                })
            );
          }
          return Promise.all(p);
        }),
      this.usdt.methods.decimals().call(),
    ]);
  }

  getEarnBusinessContractParams() {
    const methods: IObjectKeys = this.earning.methods;
    return Promise.all([
      this.earning_business.methods.params().call(),
      this.earning_business.methods
        .getPercentSize()
        .call()
        .then((data) => {
          return methods.getPercent((data as any) - 1n).call();
        }),
      this.earning_business.methods
        .getPeriodSize()
        .call()
        .then((data) => {
          const p = [];
          for (let i = 0n; i < (data as any); i++) {
            p.push(
              methods
                .getPeriod(i)
                .call()
                .then((period) => {
                  return {
                    period,
                    index: i,
                  };
                })
            );
          }
          return Promise.all(p);
        }),
      this.usdt.methods.decimals().call(),
    ]);
  }

  isBusinessWhitelisted() {
    if(this.address() == null){
      return false;
    }
    return this.earning_business.methods.isWhitelisted(this.address()).call();
  }

  getPrivKey(
    keyStore: IObjectKeys | any,
    password: string
  ): Promise<IObjectKeys> {
    return this.web3.eth.accounts.decrypt(keyStore, password);
  }

  async getLends() {
    const data = await this.earning.methods
      .userLendings()
      .call({ from: this.address() });
    const p = [];
    for (const i of data) {
      p.push(
        this.earning.methods
          .getLender(i)
          .call({ from: this.address() })
          .then(async (item) => {
            if (item.status == 0n) {
              item.rewards = await this.earning.methods
                .calculateEarn(i)
                .call({ from: this.address() });
            } else {
              item.rewards = { 0: 0n, 1: 0n };
            }
            return item;
          })
      );
    }
    return Promise.all(p);
  }

  async getLendsBusiness() {
    const data = await this.earning_business.methods
      .userLendings()
      .call({ from: this.address() });
    const p = [];
    for (const i of data) {
      p.push(
        this.earning_business.methods
          .getLender(i)
          .call({ from: this.address() })
          .then(async (item) => {
            if (item.status == 0n) {
              item.rewards = await this.earning_business.methods
                .calculateEarn(i)
                .call({ from: this.address() });
            } else {
              item.rewards = { 0: 0n, 1: 0n };
            }
            return item;
          })
      );
    }
    return Promise.all(p);
  }

  async approveTx({
    from,
    spender,
    amount,
  }: {
    from: string;
    spender: string;
    amount: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);
    spender = this.web3.utils.toHex(spender);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.usdt.methods.decimals().call(),
    ]);

    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );
    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].USDT_ADDRESS,
      value: txValue,
      data: this.usdt.methods.approve(spender, value).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = BigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async earnTx({
    from,
    amount,
    index,
  }: {
    from: string;
    amount: number;
    index: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.usdt.methods.decimals().call(),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );

    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].EARN_ADDRESS,
      value: txValue,
      data: this.earning.methods.lend(value, index).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async earnBusinessTx({
    from,
    amount,
    index,
  }: {
    from: string;
    amount: number;
    index: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.usdt.methods.decimals().call(),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );

    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].EARN_BUSINESS_ADDRESS,
      value: txValue,
      data: this.earning_business.methods.lend(value, index).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async approveLPTx({
    from,
    spender,
    amount,
  }: {
    from: string;
    spender: string;
    amount: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);
    spender = this.web3.utils.toHex(spender);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.lp.methods.decimals().call(),
    ]);

    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );
    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].LP_ADDRESS,
      value: txValue,
      data: this.lp.methods.approve(spender, value).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = BigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async stake({
    from,
    amount,
  }: {
    from: any;
    amount: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.lp.methods.decimals().call(),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );

    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].STAKING_ADDRESS,
      value: txValue,
      data: this.staking.methods.stake(value).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async xcredi_stake({
    from,
    amount,
  }: {
    from: any;
    amount: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.xcredi.methods.decimals().call(),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );

    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].XCREDI_STAKING_ADDRESS,
      value: txValue,
      data: this.xcredi_staking.methods.stake(value).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async getStakedBalance() {
    const [balance, decimal] = await Promise.all([
      this.staking.methods.getTokenBalance().call(),
      this.lp.methods.decimals().call(),
    ]);

    return Number(balance) / 10 ** Number(decimal);
  }

  async getxCrediStakedBalance() {
    let balance = 0n;
    const [indexes, decimal] = await Promise.all([
      this.xcredi_staking.methods.userStakings().call({ from: this.address() }),
      this.xcredi.methods.decimals().call(),
    ]);

    const promises = []

    for(const i of indexes){
      const fn = async () => {
        const data = await this.xcredi_staking.methods.userStaking(i).call({ from: this.address() });
        balance+=data[1];
      }
      promises.push(fn());
    }

    await Promise.all(promises);

    return Number(balance) / 10 ** Number(decimal);
  }

  async getxCrediStakingBalance() {
    let balance = 0n;
    const [indexes, decimal] = await Promise.all([
      this.staking.methods.userStakings().call({ from: this.address() }),
      this.xcredi.methods.decimals().call(),
    ]);

    const promises = []

    for(const i of indexes){
      const fn = async () => {
        const data = await this.staking.methods.userStaking(i).call({ from: this.address() });
        if(data.status == 0n){
          balance+=data[1];
        }
      }
      promises.push(fn());
    }

    await Promise.all(promises);

    return Number(balance) / 10 ** Number(decimal);
  }

  async getStakings() {
    const [data, params, decimal, xdecimal] = await Promise.all([
      this.staking.methods.userStakings().call({ from: this.address() }),
      this.staking.methods.params().call(),
      this.lp.methods.decimals().call(),
      this.xcredi.methods.decimals().call(),
    ]);
    const { 0: _lp, 1: _xcredi, 2: period, 3: _minimumAmount } = params;
    const p = [];
    for (const i of data) {
      p.push(
        this.staking.methods
          .userStaking(i)
          .call({ from: this.address() })
          .then(async (item) => {
            const amount = (
              Number(item.amount) /
              10 ** Number(decimal)
            ).toLocaleString('fullwide', {
              useGrouping: false,
              maximumFractionDigits: 6,
            });

            // const start = new Date(Number(date) * 1000);
            // const end = new Date(Number(date) * 1000);
            const { 0: xAmount, 1: _valid } = await this.staking.methods
              .calculateRewards(i)
              .call({ from: this.address() });
            const rewards = (
              Number(xAmount) /
              10 ** Number(xdecimal)
            ).toLocaleString('fullwide', {
              useGrouping: false,
              maximumFractionDigits: 6,
            });

            // start.setDate(start.getDate() + Number(item.startDay));
            // end.setDate(end.getDate() + Number(period));
            return {
              rewards,
              amount,
              // start,
              // end,
            };
          })
      );
    }
    return Promise.all(p);
  }

  async rewardsCheck() {
    const set = new Set();
    const stakers = await this.staking.methods.getStakers().call();

    for (const staker of stakers) {
      set.add(staker.user);
    }

    const arr = Array.from(set);
    const promises = [];
    let rwds = '';

    for (const staker of arr) {
      const fn = async () => {
        const indexes = await this.staking.methods
          .userStakings()
          .call({ from: staker });
        for (const index of indexes) {
          const rewards = await this.staking.methods
            .calculateRewards(index)
            .call({ from: staker });
          rwds += `${staker},${rewards[0]},${Number(rewards[0]) / 10 ** 18}\n`;
        }
      };

      promises.push(fn());
    }

    await Promise.all(promises);
    // console.log(arr )
  }

  createAccount({ password }: { password: string }) {
    const wallet = this.web3.eth.accounts.create();
    return wallet.encrypt(password);
  }

  async sendEth({
    amount,
    to,
  }: {
    amount: number;
    to: string;
  }): Promise<IObjectKeys> {
    let from = this.web3.utils.toHex(this.address());
    to = this.web3.utils.toHex(to);

    const [count, gas] = await this.prepareGas(from);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.toWei(amount, 'ether');
    const value = this.web3.utils.toHex(this.web3.utils.toBigInt(txValue));

    const rawTx: IObjectKeys = {
      from,
      to,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      value,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gasLimit = this.web3.utils.toHex(gasLimit);

    return rawTx;
  }

  async sendToken({
    amount,
    to,
    contract,
  }: {
    amount: number;
    to: string;
    contract: Contract<ContractAbi>;
  }): Promise<IObjectKeys> {
    const from = this.web3.utils.toHex(this.address());
    to = this.web3.utils.toHex(to);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      contract.methods.decimals().call(),
    ]);

    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );
    const methods: IObjectKeys = contract.methods;
    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: contract.options.address,
      value: txValue,
      data: methods.transfer(to, this.web3.utils.toBigInt(value)).encodeABI(),
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async signAndSend(rawTx: IObjectKeys, privateKey: string) {
    const tx = await this.web3.eth.accounts.signTransaction(rawTx, privateKey);
    return this.transaction(tx);
  }

  private prepareGas(address: string) {
    return Promise.all([
      this.web3.eth.getTransactionCount(address),
      this.web3.eth.getGasPrice(),
    ]);
  }

  private estimateGas(data: IObjectKeys) {
    return this.web3.eth.estimateGas(data);
  }

  private transaction(rawTx: IObjectKeys): Promise<IObjectKeys> {
    return this.web3.eth.sendSignedTransaction(rawTx.rawTransaction);
  }

  async calculateLpPrice() {
    try {
      const [
        lpAmount,
        lpDecimals,
        usdtAmount,
        usdtDecimals,
        crediAmount,
        crediDecimals,
        gecko,
      ] = await Promise.all([
        this.lp.methods.totalSupply().call(),
        this.lp.methods.decimals().call(),
        this.usdt.methods
          .balanceOf(CHAIN[this.chain()].LP_ADDRESS)
          .call({ from: CHAIN[this.chain()].LP_ADDRESS }),
        this.usdt.methods.decimals().call(),
        this.xcredi.methods
          .balanceOf(CHAIN[this.chain()].LP_ADDRESS)
          .call({ from: CHAIN[this.chain()].LP_ADDRESS }),
        this.credi.methods.decimals().call(),
        firstValueFrom(this.gacko.get()),
      ]);

      const lp = Number(lpAmount) / 10 ** Number(lpDecimals);
      const credi =
        (Number(crediAmount) / 10 ** Number(crediDecimals)) * gecko.credefi.usd;
      const usdt = Number(usdtAmount) / 10 ** Number(usdtDecimals) + credi;

      return usdt / lp;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async calculateAverageValue() {
    const [weight, balance] = await Promise.all([
      this.staking.methods.weight(STAKING_PERIOD).call(),
      this.xcredi.methods
        .balanceOf(CHAIN[this.chain()].STAKING_ADDRESS)
        .call({ from: CHAIN[this.chain()].STAKING_ADDRESS }),
    ]);
    return Number(balance) / Number(weight) / 180 / 100 / 1000;
  }

  async totalSwaped() {
    try {
      const [params, xcrediDecimals] = await Promise.all([
        this.swap.methods.params().call(),
        this.xcredi.methods.decimals().call(),
      ]);

      return Number(params[1]) / 10 ** Number(xcrediDecimals);
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async swapParams() {
    try {
      const data = await this.swap.methods.params().call();
      return { quo: data['0'], transfered: data['1'], period: data['2'] };
    } catch (error) {
      return { quo: 10, transfered: 0, period: 180 };
    }
  }

  async getSwapAmount() {
    try {
      const [data, xcrediDecimals] = await Promise.all([
        this.swap.methods.getAmount(this.address()).call(),
        this.xcredi.methods.decimals().call(),
      ]);
      const amount = Number(data['0']) / 10 ** Number(xcrediDecimals);
      return { amount, date: new Date(Number(data['1']) * 1000) };
    } catch (error) {
      return { amount: 0, date: new Date(0) };
    }
  }

  async approveCrediTx({
    from,
    spender,
    amount,
  }: {
    from: string;
    spender: string;
    amount: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);
    spender = this.web3.utils.toHex(spender);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.credi.methods.decimals().call(),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );
    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].CREDI_ADDRESS,
      value: txValue,
      data: this.credi.methods.approve(spender, value).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = BigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async approveXCrediTx({
    from,
    spender,
    amount,
  }: {
    from: string;
    spender: string;
    amount: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);
    spender = this.web3.utils.toHex(spender);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.xcredi.methods.decimals().call(),
    ]);

    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );
    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].XCREDI_ADDRESS,
      value: txValue,
      data: this.credi.methods.approve(spender, value).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = BigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async onUnstakeLP({
    from,
  }: {
    from: any;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);

    const [[count, gas]] = await Promise.all([
      this.prepareGas(from),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(0).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );

    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].STAKING_ADDRESS,
      value: txValue,
      data: this.staking.methods.withdrawPrincipal(value).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async onUnstakeStakingLP({
    from,
  }: {
    from: any;
  }): Promise<IObjectKeys> {

    const [indexes, decimal] = await Promise.all([
      this.staking.methods.userStakings().call({ from: this.address() }),
      this.xcredi.methods.decimals().call(),
    ]);

    const promises = []

    for(const i of indexes){
      const fn = async () => {
        return await this.staking.methods.userStaking(i).call({ from: this.address() }).then((data) => {
          data.index = i;
          return data;
        });
      }
      promises.push(fn());
    }

    const data = await Promise.all(promises);
    const index = data.find((item) =>{
      return item.status == 0n
    });
    from = this.web3.utils.toHex(from);
    const [[count, gas]] = await Promise.all([
      this.prepareGas(from),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );


    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].STAKING_ADDRESS,
      value: txValue,
      data: this.staking.methods.withdrawPrincipal(index.index).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async onUnstakeXcrediStaking({
    from,
  }: {
    from: any;
  }): Promise<IObjectKeys> {

    const [indexes, decimal] = await Promise.all([
      this.xcredi_staking.methods.userStakings().call({ from: this.address() }),
      this.xcredi.methods.decimals().call(),
    ]);

    const promises = []

    for(const i of indexes){
      const fn = async () => {
        return await this.xcredi_staking.methods.userStaking(i).call({ from: this.address() }).then((data) => {
          data.index = i;
          return data;
        });
      }
      promises.push(fn());
    }

    const data = await Promise.all(promises);
    const index = data.find((item) =>{
      return item.status == 0n
    });
    from = this.web3.utils.toHex(from);
    const [[count, gas]] = await Promise.all([
      this.prepareGas(from),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );


    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].XCREDI_STAKING_ADDRESS,
      value: txValue,
      data: this.xcredi_staking.methods.withdrawPrincipal(index.index).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }


  async moduleXclaim({
    from,
  }: {
    from: any;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);

    const [[count, gas]] = await Promise.all([
      this.prepareGas(from)
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );

    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].SWAP_ADDRESS,
      value: txValue,
      data: this.swap.methods.claim().encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async swapTX({
    from,
    amount,
  }: {
    from: any;
    amount: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.credi.methods.decimals().call(),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );

    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].SWAP_ADDRESS,
      value: txValue,
      data: this.swap.methods.send(value).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async onClaimUtility({
    from,
  }: {
    from: any;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);

    const [[count, gas]] = await Promise.all([
      this.prepareGas(from)
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );

    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].UTILITY_ADDRESS,
      value: txValue,
      data: this.utility.methods.claim().encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async getUtilityAmount() {
    try {
      const [data, xcrediDecimals] = await Promise.all([
        this.utility.methods.getAmount(this.address()).call(),
        this.xcredi.methods.decimals().call(),
      ]);
      const amount = Number(data['0']) / 10 ** Number(xcrediDecimals);
      return { amount, date: new Date(Number(data['1']) * 1000) };
    } catch (error) {
      return { amount: 0, date: new Date(0) };
    }
  }

  async getTierLevel() {
    try {
      const tier = await this.utility.methods
        .getTierLevel(this.address())
        .call();
      return tier;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async utilizeTX({
    from,
    amount,
  }: {
    from: any;
    amount: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.xcredi.methods.decimals().call(),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );

    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].UTILITY_ADDRESS,
      value: txValue,
      data: this.utility.methods.send(value).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  async bondSwapParams() {
    return this.bondOne.methods.params().call();
  }

  //TODO: when release bonds
  async erc1155Balance(){
    return 0n;
    if(!this.address()){
      return 0n;
    }
    return this.erc1155.methods
            .balanceOf(this.address(), 0)
            .call({ from: this.address() })
  }

  async swapBondTx({
    from,
    amount,
  }: {
    from: any;
    amount: number;
  }): Promise<IObjectKeys> {
    from = this.web3.utils.toHex(from);

    const [[count, gas], decimal] = await Promise.all([
      this.prepareGas(from),
      this.usdt.methods.decimals().call(),
    ]);
    const gasPrice = Math.round(Number(gas) * 1.8);
    const txValue = this.web3.utils.numberToHex(
      this.web3.utils.toWei('0', 'ether')
    );
    const value = Math.round(amount * 10 ** Number(decimal)).toLocaleString(
      'fullwide',
      { useGrouping: false, maximumFractionDigits: 6 }
    );

    const rawTx: IObjectKeys = {
      from,
      nonce: count.toString(),
      gasPrice: this.web3.utils.toHex(gasPrice),
      to: CHAIN[this.chain()].bonds.one.swap,
      value: txValue,
      data: this.bondOne.methods.swap(value).encodeABI() as string,
    };

    let gasLimit = await this.estimateGas({
      from: from,
      ...rawTx,
    });

    gasLimit = this.web3.utils.toBigInt(Math.round(Number(gasLimit) * 1.8));
    rawTx.gas = this.web3.utils.toHex(gasLimit);
    return rawTx;
  }

  getWallet(){
    let k = ((window as any).ethereum ?? (window as any).okxwallet);

    return k;
  }
}
