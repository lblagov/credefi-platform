import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { WalletTypes, Environment } from 'src/globals';
import { isInstalled, getPublicKey, submitTransaction, SubmitTransactionRequest } from "@gemwallet/api";
import { xrpToDrops, Client, dropsToXrp } from 'xrpl';
import { XRPL_API } from 'src/environments/environment.xrpl';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/confirm';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AES, enc, mode, pad } from 'crypto-js';
import { ApiProvider } from 'src/app/providers';
import sdk from '@crossmarkio/sdk';

@Injectable()

export class WalletXRPLProvider {
  Environment
  client: Client;
  wallet = signal<{
    type: WalletTypes,
    data?: IObjectKeys | null
  }>(null);

  address: WritableSignal<string | null> = signal<string | null>(null);
  shortAddress = signal<null | string>(null);
  dialog = inject(MatDialog);

  constructor(private http: ApiProvider) { }

  async checkRequest() {
    try {
      const balance = await this.parseBalance();
      if (Number(balance) == 0) {
        this.dialog.open(ConfirmDialog, {
          autoFocus: false,
          scrollStrategy: new NoopScrollStrategy(),
          panelClass: 'wallet-dialog',
          backdropClass: 'back-drop-class',
          data: {
            title: 'XRPL receive',
            message: `Congratulations! You will receive 12XRP bonus in ${this.address()} address as part of our incentive program. Please check your wallet in couple of minutes`,
            buttons: [
              {
                label: 'Okay',
              }
            ]
          }
        });

        const key = enc.Hex.parse(Environment.key);
        const iv = enc.Hex.parse(Environment.iv);

        const address = AES.encrypt(this.address(), key, {
          iv: iv,
          mode: mode.CBC,
          padding: pad.Pkcs7
        });

        this.http.post(`transaction/xrpl`, {
          address: address.toString()
        }).subscribe();
      }
    } catch (error) {
      console.log(error)
    }
  }

  async parseBalance() {
    try {
      const balance = await this.getBalance();
      return balance;
    } catch (e) {
      return '0';
    }
  }

  async connectGemWallet() {

    await this.getClient();

    const data = await isInstalled();

    if (data.result.isInstalled) {
      const response = await getPublicKey();

      this.wallet.set({
        data: response.result,
        type: WalletTypes.gemwallet
      });

      const address = response.result.address;
      const first = address.slice(0, 5);
      const last = address.slice(address.length - 4, address.length);

      this.address.set(address);
      this.shortAddress.set(`${first}...${last}`);
      // this.checkRequest();

    }

  }

  async connectCrossmarkWallet() {

    await this.getClient();

    const { request, response, createdAt, resolvedAt } = await sdk.methods.signInAndWait();
    if (response) {

      this.wallet.set({
        data: response.result,
        type: WalletTypes.crosswallet
      });

      const address = response.data.address;
      const first = address.slice(0, 5);
      const last = address.slice(address.length - 4, address.length);

      this.address.set(address);
      this.shortAddress.set(`${first}...${last}`);
      // this.checkRequest();

    }

  }

  async connectXummWallet(address: string) {

    await this.getClient();

    this.wallet.set({
      type: WalletTypes.xumm
    });

    const first = address.slice(0, 5);
    const last = address.slice(address.length - 4, address.length);

    this.address.set(address);
    this.shortAddress.set(`${first}...${last}`);
    // this.checkRequest();

  }

  async getClient() {
    if (this.client) {
      return this.client;
    }

    this.client = new Client(XRPL_API)
    await this.client.connect();

    return this.client;
  }

  async transactionGemWallet({
    amount,
    destination,
    memo,
  }: {
    amount: string,
    destination: string,
    memo?: Object,
  }) {

    const memos = [];

    if (memo) {
      memos.push({
        Memo: {
          MemoData: Buffer.from(JSON.stringify(memo)).toString('hex')
        }
      })
    }

    const tx: SubmitTransactionRequest = {
      "transaction": {
        "TransactionType": "Payment",
        "Account": this.address(),
        "Destination": destination,
        "Amount": xrpToDrops(amount),
        "Memos": memos

      }
    }

    return submitTransaction(tx);
  }

  async transactionTokenGemWallet({
    currency,
    destination,
    memo,
  }: {
    currency: {
      currency: string,
      issuer: string,
      value: string
    },
    destination: string,
    memo?: Object,
  }) {

    const memos = [];

    if (memo) {
      memos.push({
        Memo: {
          MemoData: Buffer.from(JSON.stringify(memo)).toString('hex')
        }
      })
    }

    const trust_set_tx: SubmitTransactionRequest = {
      "transaction": {
        "TransactionType": "Payment",
        "Account": this.address(),
        "Destination": destination,
        "Amount": currency.currency == 'XRP' ? xrpToDrops(currency.value)  : currency,
        "Memos": memos
      }

    }

    return submitTransaction(trust_set_tx);

  }

  async transactionCrossWallet({
    amount,
    destination,
    memo,
  }: {
    amount: string,
    destination: string,
    memo?: Object,
  }) {

    const memos = [];

    if (memo) {
      memos.push({
        Memo: {
          MemoData: Buffer.from(JSON.stringify(memo)).toString('hex')
        }
      })
    }

    const tx: IObjectKeys = {
        "TransactionType": "Payment",
        "Account": this.address(),
        "Destination": destination,
        "Amount": xrpToDrops(amount),
        "Memos": memos
    }

    return sdk.methods.signAndSubmitAndWait(tx);
  }

  async transactionTokenCrossWallet({
    currency,
    destination,
    memo,
  }: {
    currency: {
      currency: string,
      issuer: string,
      value: string
    },
    destination: string,
    memo?: Object,
  }) {

    const memos = [];

    if (memo) {
      memos.push({
        Memo: {
          MemoData: Buffer.from(JSON.stringify(memo)).toString('hex')
        }
      })
    }

    const trust_set_tx: IObjectKeys = {
        "TransactionType": "Payment",
        "Account": this.address(),
        "Destination": destination,
        "Amount": currency.currency == 'XRP' ? xrpToDrops(currency.value)  : currency,
        "Memos": memos
    }

    return sdk.methods.signAndSubmitAndWait(trust_set_tx);

  }

  async getBalance(address?: string) {
    await this.getClient();

    const data = await this.client.request({
      "command": "account_info",
      "account": address ?? this.address(),
      "ledger_index": "validated"
    });

    return dropsToXrp(data.result.account_data.Balance);
  }

  async getTokenBalances(address?: string) {
    await this.getClient();

    return this.client.request({
      command: "account_lines",
      account: address ?? this.address(),
      ledger_index: "validated"
    });
  }

  async txHistory(address?: string, limit = 10, marker?: IObjectKeys) {
    const data = await this.client.request({
      "command": "account_tx",
      "account": address ?? this.address(),
      "limit": limit,
      "ledger_index_min": -1,
      "ledger_index_max": -1,
      "marker": marker
    });
    return data.result;
  }

  async depositHistory(address?: string, limit = 200, marker?: IObjectKeys) {
    const data = await this.client.request({
      "command": "account_tx",
      "account": address ?? this.address(),
      "limit": limit,
      "ledger_index_min": -1,
      "ledger_index_max": -1,
      "marker": marker
    });
    return data.result;
  }



}
