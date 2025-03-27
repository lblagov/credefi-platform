import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CopyDirective } from 'src/app/directives/copy';
import { ConnectXRPLDialog } from 'src/app/helpers/connectXRPLDialog';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';
import { LoaderProvider } from 'src/app/providers';
import { WalletXRPLProvider } from 'src/app/components/main/providers/wallet/WalletXRPLProvider';
import { EXPLORER } from 'src/environments/environment.xrpl';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './index.xrpl.html',
  styleUrls: ['./style.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    NgFor, 
    NgIf,
    AddressPipe,
    HexToDecPipe,
    DecimalPipe,
    MatDialogModule,
    RouterLink,
    CopyDirective,
    MatRippleModule
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent extends ConnectXRPLDialog {

  limit = 5;
  items = signal([]);
  exporer = EXPLORER;

  constructor(
    public wallet: WalletXRPLProvider,
    private loaderProvider: LoaderProvider
  ) {
    super();
  }

  public reset() {
    this.items.set([]);
    this.loadTransactions();
  }

  private loggingEffect = effect(() => {
    if (this.wallet.address()) {
      untracked(() => {
        this.reset();
      })
    }
  });

  async loadTransactions() {
    this.loaderProvider.show();
    const data = await this.wallet.txHistory(null, this.limit);
    this.items.update((value) => [...value, ...data.transactions]);
    this.loaderProvider.hide();
  }

  track(i: number, item: IObjectKeys){
    return item.tx.hash;
  };
}
