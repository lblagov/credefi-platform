import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WalletPortfolioBodyComponent } from '../wallet-portfolio-body';;
import { AddressPipe } from 'src/app/pipes/address';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ConnectDialog } from 'src/app/helpers/connectDialog';
import { CopyDirective } from 'src/app/directives/copy';
import { track } from 'src/app/helpers/track';
import { MatRippleModule } from '@angular/material/core';
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { DepositIbanDialog } from '../debposit-iban';
import { TransferIbanDialog } from '../transfer-iban';

@Component({
  selector: 'app-portfolio-custodial',
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
    CopyDirective,
    NgFor,
    NgIf,
    MatRippleModule,
    MatDialogModule
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioCustodial extends ConnectDialog {

  wltadr = "0x1D1479C185d32EB90533a08b36B3CFa5F84A0E6B";
  dataDeposiit = {
    "iban": "FR8214508000503288225894Q91",
    "bic": "AGRIFRPPXXX",
    "ownerName": "Nilos UAB",
    "bankName": "CREDIT AGRICOLE SA"
  };

  usdc = Number(this.getCookie("balanceUSDC").length == 0 ? 10000 : this.getCookie("balanceUSDC"));

  data = [{
    walletBodyCoin: "ethereum",
    walletBodyCrypto: "ETH",
    walletBodyLong: "Ethereum",
    walletBodyValue: signal(0.000000),
    walletBodyCurrency: signal('0.00')
  },
  {
    walletBodyCoin: "tether",
    walletBodyCrypto: "USDT",
    walletBodyLong: "Tether",
    walletBodyValue: signal(0.000000),
    walletBodyCurrency: signal('1.00')
  },
  {
    walletBodyCoin: "usdc",
    walletBodyCrypto: "USDC",
    walletBodyLong: "USDC",
    walletBodyValue: signal(this.usdc),
    walletBodyCurrency: signal(this.usdc)
  }]


  constructor(
    public wallet: WalletProvider,
    private matDialog: MatDialog
  ) {
    super();
  }

  deposit() {
    this.matDialog.open(DepositIbanDialog, {
      scrollStrategy: new NoopScrollStrategy(),
      autoFocus: false,
      panelClass: 'wallet-dialog',
      backdropClass: 'back-drop-class',
      data: this.dataDeposiit
    });
  }

  trasnfer() {
    this.matDialog.open(TransferIbanDialog, {
      scrollStrategy: new NoopScrollStrategy(),
      autoFocus: false,
      panelClass: 'wallet-dialog',
      backdropClass: 'back-drop-class'
    });
  }

  getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  track = track

}
