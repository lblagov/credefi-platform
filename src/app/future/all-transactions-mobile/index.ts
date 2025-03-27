import { ChangeDetectionStrategy, Component, effect, signal, untracked } from '@angular/core';
import { HeaderComponent } from 'src/app/components/main/shared/header';
import { SidebarComponent } from '../shared/sidebar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoaderProvider } from 'src/app/providers';
import { track } from 'src/app/helpers/track';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ConnectDialog } from 'src/app/helpers/connectDialog';
import { MatDialogModule } from '@angular/material/dialog';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';
import { EXPLORER } from 'src/environments/environment';
import { CopyModule } from 'src/app/directives/copy';
import { WalletProvider } from 'src/app/components/main/providers/wallet/WalletProvider';

@Component({
  selector: 'app-all-transactions-mobile',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [HeaderComponent, MatDialogModule, SidebarComponent, MatIconModule, MatButtonModule, NgFor, NgIf, AddressPipe, HexToDecPipe, DecimalPipe, CopyModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AllTransactionsMobileComponent extends ConnectDialog {

  page: string;
  limit = 10;
  items = signal([]);
  nextPage: string | null;
  loaded = signal(false);
  exporer = EXPLORER;

  iconArrow = 'chartTableArrowDown';
  expandAllTransactionsMobileTable7: boolean = true;

  slideAllTransactionsMobileTable7 = (args: any): void => {
    if(this.iconArrow === 'chartTableArrowDown') {
      this.iconArrow = 'lightArrowUp';
    } else {
      this.iconArrow = 'chartTableArrowDown';
    }

    if (this.expandAllTransactionsMobileTable7) {
      document.querySelector("#all-transactions-id7").classList.add('expand');
      document.querySelector("#all-transactions-id7 .chart-table").classList.add('remove-border-radius');
      document.querySelector<HTMLElement>("#all-transactions-id7 .expanded").classList.remove('hide');
      this.expandAllTransactionsMobileTable7 = false;
    } else {
      document.querySelector("#all-transactions-id7").classList.remove('expand');
      document.querySelector("#all-transactions-id7 .chart-table").classList.remove('remove-border-radius');
      document.querySelector<HTMLElement>("#all-transactions-id7 .expanded").classList.add('hide');
      this.expandAllTransactionsMobileTable7 = true;
    }
  }

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
