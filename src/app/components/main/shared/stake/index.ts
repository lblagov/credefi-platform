import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { InputNumberDirective } from 'src/app/directives/number';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { track } from 'src/app/helpers/track';
import { WINDOW } from 'src/app/modules/window';
import { ErrorPipe } from 'src/app/pipes/error';
import { WalletTypes } from 'src/globals';
import { SignDialog } from '../sign';
import { LoaderProvider } from 'src/app/providers';
import { EXPLORER, STAKING_ADDRESS } from 'src/environments/environment';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AlertDialog } from '../alert';
import { WalletProvider } from '../../providers/wallet/WalletProvider';

@Component({
  selector: 'app-stake-dialog',
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
    MatDialogModule
  ],
  standalone: true
})

export class StakeDialog {

  isSubmit = signal(false);

  form = new FormGroup({
    amount: new FormControl(null, [
      Validators.required,
    ])
  });

  constructor(
    private dialog: MatDialog,
    private wallet: WalletProvider,
    private load: LoaderProvider,
    public ref: MatDialogRef<StakeDialog>,
    @Inject(MAT_DIALOG_DATA) private data,
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
          await this.onSubmitMetamask();
          break
        }
        case (WalletTypes.credi): {
          this.submitCrediWallet();
          break
        }
        case (WalletTypes.walletconnect): {
          this.onSubmitWalletConnect();
          break
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.isSubmit.set(false);
      this.ref.close();
    }

  }

  async onSubmitMetamask() {
    try {

      this.load.show();

      const value = this.form.value;
      const rawData = await this.wallet.approveLPTx({
        from: this.wallet.address(),
        spender: STAKING_ADDRESS,
        amount: value.amount
      });
      delete rawData.nonce;

      const data = await  this.wallet.getWallet()
        .request({
          method: 'eth_sendTransaction',
          params: [rawData],
        });

      const transaction = await this.checkTransaction(data);

      if (!transaction?.status) {
        await this.checkTransactionListener(data);
      }

      const r = await this.wallet.stake({ from: this.wallet.address(), amount: value.amount });
      delete r.nonce;

      const tx = await  this.wallet.getWallet()
        .request({
          method: 'eth_sendTransaction',
          params: [r],
        });


      this.window.open(`${EXPLORER}/${tx}`);

      const transaction2 = await this.checkTransaction(tx);

      if (!transaction2?.status) {
        await this.checkTransactionListener(tx);
      }

      this.form.reset()


    } catch (e) {
      this.alertDialog(e.message)
    } finally {
      this.data.callback();
      this.load.hide();
    }
  }

  async submitCrediWallet() {
    try {

      const value = this.form.value;

      const rawData = await this.wallet.approveLPTx({
        from: this.wallet.address(),
        spender: STAKING_ADDRESS,
        amount: value.amount
      });

      const tx: IObjectKeys = await this.openDialog(rawData);
      const transaction = await this.checkTransaction(tx.transactionHash);

      if (!transaction?.status) {
        await this.checkTransactionListener(tx.transactionHash);
      }

      const r = await this.wallet.stake({ from: this.wallet.address(), amount: value.amount });

      const tx2: IObjectKeys = await this.openDialog(r);

      const transaction2 = await this.checkTransaction(tx2.transactionHash);

      if (!transaction2?.status) {
        await this.checkTransactionListener(tx2.transactionHash);
      }
      window.open(`${EXPLORER}/${tx2.transactionHash}`);
      this.form.reset()

    } catch (e) {
      console.error(e)
      this.alertDialog(e.message)
    } finally {
      this.data.callback();
      this.load.hide();
    }
  }

  async onSubmitWalletConnect() {
    try {

      this.load.show();

      const value = this.form.value;
      const provider = await this.wallet.wagmiConfig.connector.getProvider();

      const rawData = await this.wallet.approveTx({
        from: this.wallet.address(),
        spender: STAKING_ADDRESS,
        amount: value.amount
      });

      const data = await provider.request({
        method: 'eth_sendTransaction',
        params: [rawData],
      });

      const transaction = await this.checkTransaction(data);

      if (!transaction?.status) {
        await this.checkTransactionListener(data);
      }

      const r = await this.wallet.stake({ from: this.wallet.address(), amount: value.amount  });

      const tx = await provider.request({
        method: 'eth_sendTransaction',
        params: [r],
      });

      const transaction2 = await this.checkTransaction(tx);

      if (!transaction2?.status) {
        await this.checkTransactionListener(tx);
      }

      window.open(`${EXPLORER}/${tx}`);
      this.form.reset()

    } catch (e) {
      this.alertDialog(e.message)
    } finally {
      this.data.callback();
      this.load.hide();
    }
  }

  openDialog(rawTx: IObjectKeys) {
    return new Promise((resolve) => {
      this.dialog.open(SignDialog, {
        scrollStrategy: new NoopScrollStrategy(),
        autoFocus: false,
        panelClass: 'wallet-dialog',
        backdropClass: 'back-drop-class',
        data: rawTx
      }).afterClosed().subscribe((data) => {
        resolve(data)
      });
    })

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
          console.error(e)
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

  alertDialog(message) {
    this.dialog.open(AlertDialog, {
      scrollStrategy: new NoopScrollStrategy(),
      autoFocus: false,
      panelClass: 'wallet-dialog',
      backdropClass: 'back-drop-class',
      data: {
        message
      }
    });
  }

  track = track

}
