import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, effect, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CopyModule } from 'src/app/directives/copy';
import { ConnectXRPLDialog } from 'src/app/helpers/connectXRPLDialog';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';
import { LoaderProvider } from 'src/app/providers';
import { WalletXRPLProvider } from 'src/app/components/main/providers/wallet/WalletXRPLProvider';
import { EXPLORER } from 'src/environments/environment.xrpl';

@Component({
  selector: 'app-transactions',
  templateUrl: './index.xrpl.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, MatButtonModule, NgFor, NgIf, AddressPipe, HexToDecPipe, DecimalPipe, MatDialogModule, RouterLink, CopyModule],
  standalone: true
})
export class TransactionsComponent extends ConnectXRPLDialog {

  page: string;
  limit = 5;
  items = signal([]);
  nextPage: string | null;
  exporer = EXPLORER;

  constructor(
    public wallet: WalletXRPLProvider,
    private loaderProvider: LoaderProvider
  ) {
    super();
  }

  public reset() {
    this.nextPage = null;
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
    const data = await this.wallet.txHistory();
    this.items.update((value) => [...value, ...data]);
    this.loaderProvider.hide();
  }

  track(i: number, item: IObjectKeys){
    return item.tx.hash;
  };
}
