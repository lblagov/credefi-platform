import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LazyImage } from '../shared/lazy-image-component';
import { MatRippleModule } from '@angular/material/core';
import { DecimalPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { ABI as XCREDI_ABI } from 'src/globals/abi-xcredi';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConnectDialog } from 'src/app/helpers/connectDialog';
import { LoaderProvider } from 'src/app/providers';
import { WalletTypes } from 'src/globals';
import { WINDOW } from 'src/app/modules/window';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { SignDialog } from '../shared/sign';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AlertDialog } from '../shared/alert';
import { track } from 'src/app/helpers/track';
import { Router } from '@angular/router';
import { ErrorPipe } from 'src/app/pipes/error';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { InputNumberDirective } from 'src/app/directives/number';
import { WalletProvider } from '../providers/wallet/WalletProvider';
import { CHAIN } from 'src/environments/environment';

@Component({
  selector: 'app-credi-stake',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    SlicePipe,
    ErrorPipe,
    AutoCompleteDirective,
    InputNumberDirective,
    NgFor,
    NgIf,
    MatDialogModule,
    DecimalPipe,
    LazyImage
  ],
  standalone: true
})

export class XCrediStakeComponent extends ConnectDialog {

  wallet = inject(WalletProvider);
  load = inject(LoaderProvider);
  matDialog = inject(MatDialog);
  window = inject(WINDOW);
  router = inject(Router);

  balance = signal(0);
  isSubmit = signal(false);
  staked = signal(0);

  form = new FormGroup({
    amount: new FormControl(null, [
      Validators.required,
    ])
  });

  constructor() {
    super();
  }

  setMax(){
    this.form.patchValue({
      amount: this.balance()
    });
  }

  private loggingEffect = effect(() => {
    if (this.wallet.address()) {
      untracked(() => {
        this.setBalance();
        this.setStaked();
      });
    }
  });

  async setBalance() {
    const balance = await this.wallet.getContractBalance({
      ABI: XCREDI_ABI,
      address: CHAIN[this.wallet.chain()].XCREDI_ADDRESS
    });
    this.balance.set(balance);
  }

  async setStaked() {
    const data = await this.wallet.getxCrediStakedBalance();
    this.staked.set(data);
  }

  async onSubmit() {
    if (this.wallet.wallet() == null) {
      return this.connect();
    }

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
          await this.submitCrediWallet();
          break
        }
        case (WalletTypes.walletconnect): {
          await this.onSubmitWalletConnect();
          break
        }
      }
      this.setBalance();
    } catch (e) {
      console.error(e)
    } finally {
      this.isSubmit.set(false);
    }
  }


  async onSubmitMetamask() {
    try {

      this.load.show();
      const value = this.form.value;
      const rawData = await this.wallet.approveXCrediTx({
        from: this.wallet.address(),
        spender: CHAIN[this.wallet.chain()].XCREDI_STAKING_ADDRESS,
        amount: value.amount
      });

      delete rawData.nonce;
      const data = await this.wallet.getWallet()
        .request({
          method: 'eth_sendTransaction',
          params: [rawData],
        });

      const transaction = await this.checkTransaction(data);

      if (!transaction?.status) {
        await this.checkTransactionListener(data);
      }

      const r = await this.wallet.xcredi_stake({ from: this.wallet.address(), amount: value.amount });
      delete r.nonce;

      const tx = await this.wallet.getWallet()
        .request({
          method: 'eth_sendTransaction',
          params: [r],
        });


      const transaction2 = await this.checkTransaction(tx);

      if (!transaction2?.status) {
        await this.checkTransactionListener(tx);
      }

      this.window.open(`${CHAIN[this.wallet.chain()].EXPLORER}/${tx}`);
      this.form.reset()
      this.setStaked();

    } catch (e) {
      this.alertDialog(e.message)
    } finally {
      this.load.hide();
    }
  }

  async submitCrediWallet() {
    try {

      const value = this.form.value;

      const rawData = await this.wallet.approveXCrediTx({
        from: this.wallet.address(),
        spender: CHAIN[this.wallet.chain()].XCREDI_STAKING_ADDRESS,
        amount: value.amount
      });

      const tx: IObjectKeys = await this.openDialog(rawData);
      const transaction = await this.checkTransaction(tx.transactionHash);

      if (!transaction?.status) {
        await this.checkTransactionListener(tx.transactionHash);
      }

      const r = await this.wallet.xcredi_stake({ from: this.wallet.address(), amount: value.amount });

      const tx2: IObjectKeys = await this.openDialog(r);

      const transaction2 = await this.checkTransaction(tx2.transactionHash);

      if (!transaction2?.status) {
        await this.checkTransactionListener(tx2.transactionHash);
      }
      window.open(`${CHAIN[this.wallet.chain()].EXPLORER}/${tx2.transactionHash}`);
      this.form.reset()
      this.setStaked();

    } catch (e) {
      this.alertDialog(e.message)
    } finally {
      this.load.hide();
    }
  }

  async onSubmitWalletConnect() {
    try {

      this.load.show();

      const value = this.form.value;
      const provider = await this.wallet.wagmiConfig.connector.getProvider();

      const rawData = await this.wallet.approveXCrediTx({
        from: this.wallet.address(),
        spender: CHAIN[this.wallet.chain()].XCREDI_STAKING_ADDRESS,
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

      const r = await this.wallet.xcredi_stake({ from: this.wallet.address(), amount: value.amount });

      const tx = await provider.request({
        method: 'eth_sendTransaction',
        params: [r],
      });

      const transaction2 = await this.checkTransaction(tx);

      if (!transaction2?.status) {
        await this.checkTransactionListener(tx);
      }

      window.open(`${CHAIN[this.wallet.chain()].EXPLORER}/${tx}`);
      this.form.reset()
      this.setStaked();


    } catch (e) {
      this.alertDialog(e.message)
    } finally {
      this.load.hide();
    }
  }

  async onClaim() {
    if (this.wallet.wallet() == null) {
      return this.connect();
    }

    try {

      this.isSubmit.set(true);

      switch (this.wallet.wallet().type) {
        case (WalletTypes.metamask): {
          await this.onClaimMetamask();
          break
        }
        case (WalletTypes.credi): {
          await this.onCalimCrediWallet();
          break
        }
        case (WalletTypes.walletconnect): {
          await this.onClaimWalletConnect();
          break
        }
      }

    } catch (e) {
      console.error(e)
    } finally {
      this.isSubmit.set(false);
    }
  }

  async onClaimMetamask() {
    try {

      this.load.show();

      const r = await this.wallet.onUnstakeXcrediStaking({ from: this.wallet.address() });
      delete r.nonce;

      const tx = await  this.wallet.getWallet()
        .request({
          method: 'eth_sendTransaction',
          params: [r],
        });


      const transaction2 = await this.checkTransaction(tx);

      if (!transaction2?.status) {
        await this.checkTransactionListener(tx);
      }

      this.window.open(`${CHAIN[this.wallet.chain()].EXPLORER}/${tx}`);
      this.form.reset()
      this.setStaked();

    } catch (e) {
      this.alertDialog(e.message)
    } finally {
      this.load.hide();
    }
  }

  async onCalimCrediWallet() {
    try {


      const r = await this.wallet.onUnstakeXcrediStaking({ from: this.wallet.address() });
      const tx2: IObjectKeys = await this.openDialog(r);

      const transaction2 = await this.checkTransaction(tx2.transactionHash);

      if (!transaction2?.status) {
        await this.checkTransactionListener(tx2.transactionHash);
      }

      window.open(`${CHAIN[this.wallet.chain()].EXPLORER}/${tx2.transactionHash}`);
      this.form.reset()
      this.setStaked();

    } catch (e) {
      this.alertDialog(e.message)
    } finally {
      this.load.hide();
    }
  }

  async onClaimWalletConnect() {
    try {

      this.load.show();

      const provider = await this.wallet.wagmiConfig.connector.getProvider();
      const r = await this.wallet.onUnstakeXcrediStaking({ from: this.wallet.address() });

      const tx = await provider.request({
        method: 'eth_sendTransaction',
        params: [r],
      });

      const transaction2 = await this.checkTransaction(tx);

      if (!transaction2?.status) {
        await this.checkTransactionListener(tx);
      }

      window.open(`${CHAIN[this.wallet.chain()].EXPLORER}/${tx}`);
      this.form.reset()
      this.setStaked();


    } catch (e) {
      this.alertDialog(e.message)
    } finally {
      this.load.hide();
    }
  }


  openDialog(rawTx: IObjectKeys) {
    return new Promise((resolve) => {
      this.matDialog.open(SignDialog, {
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
    this.matDialog.open(AlertDialog, {
      scrollStrategy: new NoopScrollStrategy(),
      autoFocus: false,
      panelClass: 'wallet-dialog',
      backdropClass: 'back-drop-class',
      data: {
        message
      }
    });
  }

  canStake(){
    return CHAIN[this.wallet.chain()].lpstake;
  }

  track = track;

}
