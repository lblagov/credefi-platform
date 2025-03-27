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
import { CopyModule } from 'src/app/directives/copy';
import { ConnectXRPLDialog } from 'src/app/helpers/connectXRPLDialog';
import { IObjectKeys } from 'src/app/helpers/interfaces';

@Component({
  selector: 'app-all-transactions-mobile',
  templateUrl: './index.xrpl.html',
  styleUrls: ['./style.scss'],
  imports: [HeaderComponent, MatDialogModule, SidebarComponent, MatIconModule, MatButtonModule, NgFor, NgIf, AddressPipe, HexToDecPipe, DecimalPipe, CopyModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AllTransactionsMobileComponent extends ConnectXRPLDialog {

  page: string;
  limit = 10;
  items = signal([]);
  nextPage: string | null;
  loaded = signal(false);
  exporer = EXPLORER;

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
    const data = await this.wallet.txHistory();
    this.items.update((value) => [...value, ...data]);
    this.loaderProvider.hide();
  }

  track(i: number, item: IObjectKeys){
    return item.tx.hash;
  };

}
