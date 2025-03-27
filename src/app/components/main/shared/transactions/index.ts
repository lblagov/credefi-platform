import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CopyDirective } from 'src/app/directives/copy';
import { ConnectDialog } from 'src/app/helpers/connectDialog';
import { track } from 'src/app/helpers/track';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';
import { LoaderProvider } from 'src/app/providers';
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { CHAIN } from 'src/environments/environment';

@Component({
  selector: 'app-transactions',
  templateUrl: './index.html',
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
    MatRippleModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent extends ConnectDialog {
  limit = 5;
  items = signal([]);
  bank = [];
  exporer = CHAIN[this.wallet.chain()].EXPLORER;

  constructor(
    public wallet: WalletProvider,
    private loaderProvider: LoaderProvider
  ) {
    super();
  }

  public reset() {
    this.items.set([]);
    this.loadTransactions();
  }

  private loggingEffect = effect(() => {
    const bankTransactions = this.getCookie('bankhistory');
    if (this.wallet.address()) {
      untracked(() => {
        this.reset();
      });
    }

    if (bankTransactions) {
      let bankHistoryStr = this.getCookie('bankhistory');
      let bankHistory = [];

      if (bankHistoryStr.length > 0) {
        try {
          bankHistory = JSON.parse(decodeURIComponent(bankHistoryStr));
        } catch (e) {
          console.error('Error parsing bankhistory cookie:', e);
          bankHistory = [];
        }
      }

      this.bank = bankHistory;
    }
  });

  async loadTransactions() {
    try {
      this.loaderProvider.show();
      const data = await this.wallet.getTransactions(this.limit);
      this.items.update((value) => [...value, ...data.result.transfers]);
    } catch (e) {
      console.log(e);
    } finally {
      this.loaderProvider.hide();
    }
  }

  getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  track = track;
}
