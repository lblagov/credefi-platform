import { ChangeDetectionStrategy, Component, Input, effect, signal, untracked } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WalletPortfolioBodyComponent } from '../wallet-portfolio-body';
import { ABI as USDT_ABI } from 'src/globals/abi-usdt';
import { ABI as CREDI_ABI } from 'src/globals/abi-credi';
import { AddressPipe } from 'src/app/pipes/address';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { WalletTypes } from 'src/globals';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrivateKeyDialog } from '../private-key';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { DepositDialog } from '../deposit';
import { ConnectDialog } from 'src/app/helpers/connectDialog';
import { TransferDialog } from '../transfer';
import { CopyDirective } from 'src/app/directives/copy';
import { TransactionsComponent } from '../transactions';
import { track } from 'src/app/helpers/track';
import { GeckoProvider } from '../../providers';
import { MatRippleModule } from '@angular/material/core';
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { CHAIN, DefaultChain } from 'src/environments/environment';

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
    CopyDirective,
    NgFor,
    NgIf,
    MatRippleModule
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioWalletComponent extends ConnectDialog {

  @Input() transactions: TransactionsComponent;

  data = [{
    walletBodyCoin: "credi",
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
  }]

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
        address: CHAIN[this.wallet.chain()].CREDI_ADDRESS
      }),
      this.wallet.getBalance(),
      this.wallet.getContractBalance({
        ABI: USDT_ABI,
        address: CHAIN[this.wallet.chain()].USDT_ADDRESS
      }),
    ]);

    data.forEach((item, index) => {
      this.data[index].walletBodyValue.set(item);
    });

    const [credi, eth] = data;

    this.gecko.get().subscribe((item) => {
      const { credefi = 0, ethereum = 0, binancecoin = 0 } = item;
      const crediBalance = (credi * credefi.usd).toFixed(2);
      let ethBalance = '0.00';
      switch(DefaultChain){
        case("ethereum"):{
          ethBalance = (eth * ethereum.usd).toFixed(2);
          break;
        }
        case("binance"):{
          ethBalance = (eth * binancecoin.usd).toFixed(2);
          break;
        }
      }
      if(DefaultChain )
      this.data[0].walletBodyCurrency.set(`$${crediBalance}`);
      this.data[1].walletBodyCurrency.set(`$${ethBalance}`);
    });
  }

  decrypt() {
    if (this.wallet.wallet()?.type == WalletTypes.credi) {
      this.matDialog.open(PrivateKeyDialog, {
        scrollStrategy: new NoopScrollStrategy(),
        autoFocus: false,
        panelClass: 'wallet-dialog',
        backdropClass: 'back-drop-class'
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
        panelClass: 'wallet-dialog',
        backdropClass: 'back-drop-class'
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
