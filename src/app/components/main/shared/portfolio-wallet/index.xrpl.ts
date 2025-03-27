import { ChangeDetectionStrategy, Component, Input, OnInit, effect, signal, untracked } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WalletPortfolioBodyComponent } from '../wallet-portfolio-body';
import { AddressPipe } from 'src/app/pipes/address';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { WalletTypes } from 'src/globals';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrivateKeyDialog } from '../private-key';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { DepositDialog } from '../deposit';
import { TransferDialog } from '../transfer';
import { CopyDirective } from 'src/app/directives/copy';
import { TransactionsComponent } from '../transactions';
import { WalletXRPLProvider } from 'src/app/components/main/providers/wallet/WalletXRPLProvider';
import { track } from 'src/app/helpers/track';
import { ConnectXRPLDialog } from 'src/app/helpers/connectXRPLDialog';
import { XRPL_TOKENS } from 'src/environments/environment.xrpl';
import { GeckoProvider } from '../../providers';

@Component({
  selector: 'app-portfolio-wallet',
  templateUrl: './index.xrpl.html',
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
    CopyDirective,
    NgFor,
    NgIf
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioWalletComponent extends ConnectXRPLDialog implements OnInit {
  @Input() walletLogo: string;
  @Input() walletTitle: string;
  @Input() transactions: TransactionsComponent;

  data = [
    {
      walletBodyCoin: "xrpl",
      walletBodyCrypto: "XRPL",
      walletBodyLong: "XRPL",
      walletBodyValue: signal(0.000000),
      walletBodyCurrency: signal('$0.00')
    },
    // {
    //   walletBodyCoin: "usd-icon",
    //   walletBodyCrypto: "USD",
    //   walletBodyLong: "GateHub USD",
    //   walletBodyValue: signal(0.000000),
    //   walletBodyCurrency: signal('$1.00')
    // },
    {
      walletBodyCoin: "usd-icon",
      walletBodyCrypto: "RLUSD",
      walletBodyLong: "RLUSD",
      walletBodyValue: signal(0.000000),
      walletBodyCurrency: signal('$1.00')
    },
    {
      walletBodyCoin: "eur-icon",
      walletBodyCrypto: "EUR",
      walletBodyLong: "GateHub EUR",
      walletBodyValue: signal(0.000000),
      walletBodyCurrency: signal('Є1.00')
    }
  ]

  WalletTypes = WalletTypes;

  constructor(
    private matDialog: MatDialog,
    public wallet: WalletXRPLProvider,
    private gecko: GeckoProvider
  ) {
    super();
  }

  ngOnInit() {
    this.loadPrice();
  }

  private loggingEffect = effect(() => {
    if (this.wallet.address()) {
      untracked(() => {
        this.loadData();
      })
    }
  });

  private async loadData() {
    const [balance, tokens] = await Promise.all([
      this.wallet.getBalance(),
      this.wallet.getTokenBalances()
    ]);

    for (const currency of tokens.result?.lines) {
      const index = XRPL_TOKENS.findIndex((item) => item.address == currency.currency && item.issuer == currency.account);
      const item = XRPL_TOKENS[index];
      const itemDataIndex = this.data.findIndex((d) => d.walletBodyLong == item?.name);
      if (itemDataIndex > -1) {
        this.data[itemDataIndex].walletBodyValue.set(Number(currency.balance));
      }
    }


    this.data[0].walletBodyValue.set(Number(balance));
  }

  loadPrice() {
    this.gecko.get().subscribe((item) => {
      const { ripple } = item;
      const xrplPrice = (ripple?.usd ?? 0).toFixed(2);
      this.data[0].walletBodyCurrency.set(`$${xrplPrice}`);
    });
  }

  decrypt() { }

  deposit() {
    if (this.wallet.address()?.length > 0) {
      this.matDialog.open(DepositDialog, {
        scrollStrategy: new NoopScrollStrategy(),
        autoFocus: false,
        panelClass: 'wallet-dialog',
        backdropClass: 'back-drop-class',
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
        panelClass: 'wallet-dialog',
        backdropClass: 'back-drop-class'
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
