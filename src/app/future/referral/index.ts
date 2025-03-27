import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReferralBannerComponent } from '../shared/referral-banner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TransactionsComponent } from '../shared/transactions';
import { TransactionsMobileComponent } from '../shared/transactions-mobile';
import { CommonModule } from '@angular/common';
import { BannerReferralMobileComponent } from '../shared/banner-referral-mobile';

@Component({
  selector: 'app-referral',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  imports: [ MatIconModule, MatButtonModule, ReferralBannerComponent, 
     MatInputModule, MatFormFieldModule, TransactionsComponent, TransactionsMobileComponent, CommonModule,BannerReferralMobileComponent  ]

})
export class ReferralComponent {
  title="Autonomous Earning is live!";
  description="Unlock the power of your stablecoins and earn interest on autopilot!";
  image = "./assets/images/dashboardBanner.png"
  currentPage = "Referral program"
  color1 = "#6FACFF"
  color2 = "#5C68FF"
  color3 = "#2984FE"
  linearGradient = "background: linear-gradient(91.78deg, #6FACFF, #5C68FF,#2984FE);"
  height = "1160px"
  transactionsTitle = "Recent Transactions";
  transactionsButton= "View all";

  isMobile: boolean;

  iconArrow = 'chartTableArrowDown';
  
  public iconArrow1 = 'chartTableArrowDown';

  expandTransactionsMobileTable3: boolean = true;

  slideTransactionsMobileTable3 = (args: any): void => {
    if(this.iconArrow1 === 'chartTableArrowDown') {
      this.iconArrow1 = 'lightArrowUp';
    } else {
      this.iconArrow1 = 'chartTableArrowDown';
    }

    if (this.expandTransactionsMobileTable3) {
      document.querySelector("#transactions-id3").classList.add('expand');
      document.querySelector("#transactions-id3 .chart-table").classList.add('remove-border-radius');
      document.querySelector<HTMLElement>("#transactions-id3 .expanded").classList.remove('hide');
      this.expandTransactionsMobileTable3 = false;
    } else {
      document.querySelector("#transactions-id3").classList.remove('expand');
      document.querySelector("#transactions-id3 .chart-table").classList.remove('remove-border-radius');
      document.querySelector<HTMLElement>("#transactions-id3 .expanded").classList.add('hide');
      this.expandTransactionsMobileTable3 = true;
    }
  }

  constructor() {
      this.isMobile = window.outerWidth <= 700;
  }

}
