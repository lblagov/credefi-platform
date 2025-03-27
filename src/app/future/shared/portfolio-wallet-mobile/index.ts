import { Component, Input, effect, signal, untracked } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WalletPortfolioBodyComponent } from '../../wallet-portfolio-body';
import { WalletPortfolioBodyMobileComponent } from '../../wallet-portfolio-body-mobile';


import { WalletProvider } from 'src/app/providers/wallet/WalletProvider';
import { ABI as USDT_ABI } from 'src/globals/abi-usdt';
import { ABI as CREDI_ABI } from 'src/globals/abi-credi';
import { CREDI_ADDRESS, USDT_ADDRESS } from 'src/environments/environment';
import { AddressPipe } from 'src/app/pipes/address';
import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { WalletTypes } from 'src/globals';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrivateKeyDialog } from '../private-key';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { DepositDialog } from '../deposit';
import { ConnectDialog } from 'src/app/helpers/connectDialog';
import { TransferDialog } from '../transfer';
import { CopyModule } from 'src/app/directives/copy';
import { TransactionsComponent } from '../transactions';
import { track } from 'src/app/helpers/track';
import { GeckoProvider } from '../../providers';

@Component({
  selector: 'app-portfolio-wallet-mobile',
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
    NgFor,
    WalletPortfolioBodyMobileComponent
  ],
  standalone: true
})
export class PortfolioWalletMobileComponent extends ConnectDialog {
  @Input() walletLogo: string;
  @Input() walletTitle: string;
  @Input() transactions: TransactionsComponent;

  data = [
    {
    walletBodyCoin: "ethereum",
    walletBodyCrypto: "CREDI",
    walletBodyLong: "Credi",
    walletBodyValue: signal(0.000000),
    walletBodyCurrency: signal('$0.00')
  },
  {
    walletBodyCoin: "ethereum",
    walletBodyCrypto: "ETH",
    walletBodyLong: "Ethereum",
    walletBodyValue: signal(0.000000),
    walletBodyCurrency: signal('$0.00')
  },
  {
    walletBodyCoin: "tether",
    walletBodyCrypto: "USDT",
    walletBodyLong: "Tether",
    walletBodyValue: signal(0.000000),
    walletBodyCurrency: signal('$1.00')
  },
  {
    walletBodyCoin: "tether",
    walletBodyCrypto: "ADA",
    walletBodyLong: "Credi",
    walletBodyValue: signal(0.000000),
    walletBodyCurrency: signal('$0.00')
  },
  {
    walletBodyCoin: "ethereum",
    walletBodyCrypto: "BNB",
    walletBodyLong: "Ethereum",
    walletBodyValue: signal(0.000000),
    walletBodyCurrency: signal('$0.00')
  },
  {
    walletBodyCoin: "tether",
    walletBodyCrypto: "USDT",
    walletBodyLong: "Tether",
    walletBodyValue: signal(0.000000),
    walletBodyCurrency: signal('$1.00')
  }

]


  WalletTypes = WalletTypes;

  constructor(
    private matDialog: MatDialog,
    public wallet: WalletProvider,
    private gecko: GeckoProvider
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
    const data = await Promise.all([
      this.wallet.getContractBalance({
        ABI: CREDI_ABI,
        address: CREDI_ADDRESS
      }),
      this.wallet.getBalance(),
      this.wallet.getContractBalance({
        ABI: USDT_ABI,
        address: USDT_ADDRESS
      }),

    ]);

    data.forEach((item, index) => {
      this.data[index].walletBodyValue.set(item);
    });

    const [credi, eth] = data;

    this.gecko.get().subscribe((item) => {
      const { credefi = 0, ethereum = 0 } = item;
      const crediBalance = (credi * credefi.usd).toFixed(2);
      const ethBalance = (eth * ethereum.usd).toFixed(2);
      this.data[0].walletBodyCurrency.set(`$${crediBalance}`);
      this.data[1].walletBodyCurrency.set(`$${ethBalance}`);
    });

  }

  decrypt() {
    if (this.wallet.wallet()?.type == WalletTypes.credi) {
      this.matDialog.open(PrivateKeyDialog, {
        scrollStrategy: new NoopScrollStrategy(),
        autoFocus: false,
        panelClass: 'wallet-dialog'
      });
    } else {
      this.connect();
    }
  }

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
