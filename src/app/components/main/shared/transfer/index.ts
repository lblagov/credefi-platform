import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { InputNumberDirective } from 'src/app/directives/number';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { track } from 'src/app/helpers/track';
import { WINDOW } from 'src/app/modules/window';
import { ErrorPipe } from 'src/app/pipes/error';
import { CurrencyTypes, WalletTypes } from 'src/globals';
import { SignDialog } from '../sign';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ContractAbi } from 'web3';
import { Contract as IContract } from 'web3-eth-contract';
import { LoaderProvider } from 'src/app/providers';
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { CHAIN, DefaultChain } from 'src/environments/environment';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    SlicePipe,
    ErrorPipe,
    AutoCompleteDirective,
    InputNumberDirective,
    NgFor,
    NgIf,
    SignDialog
  ],
  standalone: true
})

export class TransferDialog {

  isSubmit = signal(false);

  currencies = [
    {
      name: CHAIN[DefaultChain].currency,
      type: CurrencyTypes.eth
    },
    {
      name: 'CREDI',
      type: CurrencyTypes.credi
    },
    {
      name: 'USDT',
      type: CurrencyTypes.usdt
    }
  ];

  form = new FormGroup({
    currency: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
    ]),
    wallet: new FormControl(null, [
      Validators.required,
    ]),
  });

  constructor(
    private dialog: MatDialog,
    private wallet: WalletProvider,
    private load: LoaderProvider,
    public walletProvider: WalletProvider,
    public ref: MatDialogRef<TransferDialog>,
    @Inject(WINDOW) private window: IObjectKeys,
  ) { }

  async onSubmit() {

    if (this.form.invalid) {
      return false;
    }

    try {

      this.isSubmit.set(true);

      switch (this.wallet.wallet().type) {
        case (WalletTypes.metamask): {
          const data = await this.parseSendMetamask();
          const transaction = await this.checkTransaction(data);

          if (!transaction?.status) {
            await this.checkTransactionListener(data);
          }
          this.ref.close(true);
          break
        }
        case (WalletTypes.credi): {
          this.parseSend();
          break
        }
        case (WalletTypes.walletconnect): {
          this.parseSendWalletConnect();
          break
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.isSubmit.set(false);
    }

  }

  async parseSendMetamask() {
    try {
      const value = this.form.value;
      switch (value.currency) {
        case (CurrencyTypes.eth): {
          const rawTx = await this.getRawTx();
          delete rawTx.nonce;

          return this.signMetamask(rawTx);
        }
        case (CurrencyTypes.credi): {
          const rawTx = await this.getRawTokenTx(this.wallet.credi);
          delete rawTx.nonce;

          return this.signMetamask(rawTx);
        }
        case (CurrencyTypes.usdt): {
          const rawTx = await this.getRawTokenTx(this.wallet.usdt);
          delete rawTx.nonce;

          return this.signMetamask(rawTx);
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  signMetamask(tx: IObjectKeys) {
    let w = this.window;
    return  this.wallet.getWallet()
      .request({
        method: 'eth_sendTransaction',
        params: [tx],
      });
  }

  async parseSend() {

    const value = this.form.value;

    try {
      switch (value.currency) {
        case (CurrencyTypes.eth): {
          const rawTx = await this.getRawTx();
          return this.openDialog(rawTx);
        }
        case (CurrencyTypes.credi): {
          const rawTx = await this.getRawTokenTx(this.wallet.credi);
          return this.openDialog(rawTx);
        }
        case (CurrencyTypes.usdt): {
          const rawTx = await this.getRawTokenTx(this.wallet.usdt);
          return this.openDialog(rawTx);
        }
      }
    } catch (e) {
      console.log(e)
    }

  }

  async parseSendWalletConnect() {
    try {
      const value = this.form.value;
      switch (value.currency) {
        case (CurrencyTypes.eth): {
          const rawTx = await this.getRawTx();
          this.signWalletConnect(rawTx);
          break;
        }
        case (CurrencyTypes.credi): {
          const rawTx = await this.getRawTokenTx(this.wallet.credi);
          this.signWalletConnect(rawTx);
          break;
        }
        case (CurrencyTypes.usdt): {
          const rawTx = await this.getRawTokenTx(this.wallet.usdt);
          this.signWalletConnect(rawTx);
          break;
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  async signWalletConnect(rawTx: IObjectKeys) {
    try {

      const provider = await this.wallet.wagmiConfig.connector.getProvider();
      this.load.show();

      await provider.request({
        method: 'eth_sendTransaction',
        params: [rawTx]
      }, this.wallet.wagmiConfig.connector);

      this.ref.close();
    } catch (e) {
      console.error(e)
    }finally{
      this.load.hide();
    }
  }

  openDialog(rawTx: IObjectKeys) {
    this.dialog.open(SignDialog, {
      scrollStrategy: new NoopScrollStrategy(),
      autoFocus: false,
      panelClass: 'wallet-dialog',
      backdropClass: 'back-drop-class',
      data: rawTx
    }).afterClosed().subscribe(() => {
      this.ref.close(true);
    });
  }

  getRawTx() {
    const value = this.form.value;
    return this.wallet.sendEth({
      amount: value.amount,
      to: value.wallet
    });
  }

  getRawTokenTx(contract: IContract<ContractAbi>) {
    const value = this.form.value;
    return this.wallet.sendToken({
      amount: value.amount,
      to: value.wallet,
      contract
    });
  }

  checkTransactionListener(hash: string) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        this.wallet.web3.eth.getTransactionReceipt(hash).then((transaction) => {
          if (transaction?.status) {
            clearInterval(interval);
            return resolve(transaction);
          }
        }).catch((e: Error) => {
          console.log(e)
        });
      }, 20000);
    });
  }

  async checkTransaction(hash: string) {
    try {
      return await this.wallet.web3.eth.getTransactionReceipt(hash);
    } catch (e) {
      return null;
    }
  }

  track = track

}
