import { Component, Input, effect, signal, untracked } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WalletPortfolioBodyComponent } from '../../wallet-portfolio-body';
import { AddressPipe } from 'src/app/pipes/address';
import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { WalletTypes } from 'src/globals';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrivateKeyDialog } from '../private-key';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { DepositDialog } from '../deposit';
import { TransferDialog } from '../transfer';
import { CopyModule } from 'src/app/directives/copy';
import { TransactionsComponent } from '../transactions';
import { WalletXRPLProvider } from 'src/app/components/main/providers/wallet/WalletXRPLProvider';
import { track } from 'src/app/helpers/track';
import { ConnectXRPLDialog } from 'src/app/helpers/connectXRPLDialog';

@Component({
  selector: 'app-portfolio-wallet',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [
    MatIconModule,
    WalletPortfolioBodyComponent,
    MatButtonModule,
    AddressPipe,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    MatDialogModule,
    PrivateKeyDialog,
    DepositDialog,
    TransferDialog,
    CopyModule,
    NgFor
  ],
  standalone: true
})
export class PortfolioWalletComponent extends ConnectXRPLDialog {
  @Input() walletLogo: string;
  @Input() walletTitle: string;
  @Input() transactions: TransactionsComponent;

  data = [{
    walletBodyCoin: "xrpl",
    walletBodyCrypto: "XRPL",
    walletBodyLong: "XRPL",
    walletBodyValue: signal(0.000000),
    walletBodyCurrency: "0.00$"
  }]

  WalletTypes = WalletTypes;

  constructor(
    private matDialog: MatDialog,
    public wallet: WalletXRPLProvider,
  ) {
    super();
  }

  private loggingEffect = effect(() => {
    if (this.wallet.address()) {
      untracked(() => {
        this.loadData();
      })
    }
  });

  private async loadData() {
    const balance = await this.wallet.getBalance();
    this.data[0].walletBodyValue.set(Number(balance));
  }

  decrypt() { }

  deposit() {
    if (this.wallet.address()?.length > 0) {
      this.matDialog.open(DepositDialog, {
        scrollStrategy: new NoopScrollStrategy(),
        autoFocus: false,
        panelClass: 'wallet-dialog'
      });
    } else {
      this.connect();
    }
  }

  transfer() {
    if (this.wallet.address()?.length > 0) {
      this.matDialog.open(TransferDialog, {
        scrollStrategy: new NoopScrollStrategy(),
        autoFocus: false,
        panelClass: 'wallet-dialog'
      }).afterClosed().subscribe((data) => {
        if (data) {
          this.loadData();
          this.transactions.reset();
        }
      });
    } else {
      this.connect();
    }
  }

  track = track

} 
