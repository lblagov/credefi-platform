import { ChangeDetectionStrategy, Component, effect, signal, untracked } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoaderProvider } from 'src/app/providers';
import { track } from 'src/app/helpers/track';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ConnectDialog } from 'src/app/helpers/connectDialog';
import { MatDialogModule } from '@angular/material/dialog';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';
import { CHAIN } from 'src/environments/environment';
import { CopyDirective } from 'src/app/directives/copy';
import { MatRippleModule } from '@angular/material/core';
import { WalletProvider } from '../providers/wallet/WalletProvider';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    NgFor,
    NgIf,
    AddressPipe,
    HexToDecPipe,
    DecimalPipe,
    CopyDirective,
    MatRippleModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AllTransactionsComponent extends ConnectDialog {

  page: string;
  limit = 10;
  items = signal([]);
  nextPage: string | null;
  loaded = signal(false);
  exporer = CHAIN[this.wallet.chain()].EXPLORER;
  owner = CHAIN[this.wallet.chain()].OWNER;

  constructor(
    public wallet: WalletProvider,
    private loaderProvider: LoaderProvider
  ) {
    super();
  }

  public resetLoad() {
    this.loaded.set(false);
    this.items.set([]);
    this.loadTransactions();
  }

  private loggingEffect = effect(() => {
    if (this.wallet.address()) {
      untracked(() => {
        this.resetLoad();
      })
    }
  });

  async loadTransactions() {
    try{
      this.loaderProvider.show();
      const data = await this.wallet.getTransactions(this.limit, this.nextPage);
      this.nextPage = data.result.pageKey;
      this.items.update((value) => [...value, ...data.result.transfers]);
      if (!data.result.pageKey) {
        this.loaded.set(true);
      }
    }catch(e){
      console.log(e)
    }finally{
      this.loaderProvider.hide();
    }
  }

  track = track;
}
