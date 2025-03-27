import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, effect, signal, untracked, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CopyModule } from 'src/app/directives/copy';
import { ConnectDialog } from 'src/app/helpers/connectDialog';
import { track } from 'src/app/helpers/track';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';
import { LoaderProvider } from 'src/app/providers';
import { WalletProvider } from 'src/app/providers/wallet/WalletProvider';
import { EXPLORER } from 'src/environments/environment';

@Component({
  selector: 'app-transactions-mobile',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, MatButtonModule, NgFor, NgIf, AddressPipe, HexToDecPipe, DecimalPipe, MatDialogModule, RouterLink, CopyModule],
  standalone: true
})
export class TransactionsMobileComponent extends ConnectDialog {
  @Input() iconArrow: string;
  @Input() slideTransactionsMobileTable: (args: any) => void;
  page: string;
  limit = 5;
  items = signal([]);
  nextPage: string | null;
  exporer = EXPLORER;

  constructor(
    public wallet: WalletProvider,
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
    try{
      this.loaderProvider.show();
      const data = await this.wallet.getTransactions(this.limit, this.nextPage);
      this.nextPage = data.result.pageKey;
      this.items.update((value) => [...value, ...data.result.transfers]);
    }catch(e){
      console.log(e)
    }finally{
      this.loaderProvider.hide();
    }
  }

  track = track;
}
