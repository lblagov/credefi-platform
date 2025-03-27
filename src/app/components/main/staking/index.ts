import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal, untracked } from '@angular/core';
import { PortfolioStakingComponent } from '../shared/portfolio-staking';
import { TypeOfStakingComponent } from '../shared/type-of-staking';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConnectDialog } from 'src/app/helpers/connectDialog';
import { NgFor, NgIf } from '@angular/common';
import { trackByIndex } from 'src/app/helpers/track';
import { Router } from '@angular/router';
import { WalletProvider } from '../providers/wallet/WalletProvider';

@Component({
  selector: 'app-staking',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [
    PortfolioStakingComponent,
    TypeOfStakingComponent,
    MatDialogModule,
    NgFor,
    NgIf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})

export class StakingComponent extends ConnectDialog implements OnInit {

  matDialog = inject(MatDialog);
  wallet = inject(WalletProvider);
  router = inject(Router);

  stakings = signal([]);
  tvl = signal(0);
  ar = signal(0);

  redirect = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setBalace();
    // this.setWeight();
  }

  async setBalace() {
    const [amount, price] = await Promise.all([
      this.wallet.getStakedBalance(),
      this.wallet.calculateLpPrice()
    ]);
    this.tvl.set(amount * price);
  }

  // async setWeight(){
  //   const ar = await this.wallet.calculateAverageValue();
  //   this.ar.set(ar);
  // }

  private loggingEffect = effect(() => {
    if (this.wallet.address()) {
      if (this.redirect) {
        this.redirect = false;
        return this.router.navigateByUrl('/stake');
      }
      untracked(() => {
        this.onLoadStakings();
      });
    }
  });

  async onLoadStakings() {
    const data = await this.wallet.getStakings();
    this.stakings.set(data);
  }

  onStake() {
    if (this.wallet.wallet() == null) {
      this.redirect = true;
      return this.connect();
    }

    this.router.navigateByUrl('/stake');
  }

  track = trackByIndex

}
