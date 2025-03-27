import { ChangeDetectionStrategy, Component, effect, signal, untracked } from '@angular/core';
import { HeaderComponent } from 'src/app/components/main/shared/header';
import { SidebarComponent } from '../shared/sidebar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WalletXRPLProvider } from 'src/app/components/main/providers/wallet/WalletXRPLProvider';
import { LoaderProvider } from 'src/app/providers';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';
import { EXPLORER } from 'src/environments/environment.xrpl';
import { CopyDirective } from 'src/app/directives/copy';
import { ConnectXRPLDialog } from 'src/app/helpers/connectXRPLDialog';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './index.xrpl.html',
  styleUrls: ['./style.scss'],
  imports: [
    HeaderComponent,
    MatDialogModule,
    SidebarComponent,
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
export class AllTransactionsComponent extends ConnectXRPLDialog {

  page: string;
  items = signal([]);
  loaded = signal(false);
  exporer = EXPLORER;
  limit = 10;
  nextPage: IObjectKeys | null;


  constructor(
    public wallet: WalletXRPLProvider,
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
    this.loaderProvider.show();
    const data = await this.wallet.txHistory(null, this.limit, this.nextPage);
    this.items.update((value) => [...value, ...data.transactions]);
    this.nextPage = data.marker;

    if (!data.marker) {
      this.loaded.set(true);
    }

    this.loaderProvider.hide();
  }

  track(i: number, item: IObjectKeys) {
    return item.tx.hash;
  };

}
