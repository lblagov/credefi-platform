import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { PortfolioStakingComponent } from '../shared/portfolio-staking';
import { TypeOfStakingComponent } from '../shared/type-of-staking';
import { MatDialogModule } from '@angular/material/dialog';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LazyImage } from '../shared/lazy-image-component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { WalletProvider } from '../providers/wallet/WalletProvider';
import { CopyDirective } from 'src/app/directives/copy';
import { CHAIN } from 'src/environments/environment';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';

@Component({
  selector: 'app-bonds',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [
    PortfolioStakingComponent,
    TypeOfStakingComponent,
    MatDialogModule,
    RouterLink,
    NgFor,
    LazyImage,
    MatIconModule,
    NgIf,
    MatExpansionModule,
    MatButtonModule,
    DecimalPipe,
    CopyDirective,
    AddressPipe,
    HexToDecPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BondsComponent {
  views = {
    catalogue: 0,
    myBonds: 1,
  };

  infoActive = signal(this.views.catalogue);
  balance = signal(0n);
  bondAddress = signal(CHAIN[this.walletProvider.chain()].bonds.one.swap)
  explorer = CHAIN[this.walletProvider.chain()].EXPLORER;
  tx = "0x27e894420a8a614b5c67384a1f74755729b58946da042bf3b5ed6992ac551f9c";

  constructor(private walletProvider: WalletProvider) {}

  private loggingEffect = effect(() => {
    if (this.walletProvider.address()) {
      untracked(() => {
        this.erc1155Balance();
      });
    }
  });

  async erc1155Balance() {
    const balance = await this.walletProvider.erc1155Balance();
    this.balance.set(balance);
  }

  setInfo(view) {
    this.infoActive.set(view);
  }
}
