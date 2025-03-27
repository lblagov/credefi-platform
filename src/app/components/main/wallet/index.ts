import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from 'src/app/components/main/shared/header';
import { MatButtonModule } from '@angular/material/button';
import { TransactionsComponent } from '../shared/transactions';
import { PortfolioWalletComponent } from '../shared/portfolio-wallet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateWalletDialog } from '../shared/create-wallet';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { PortfolioIbanUsdComponent } from '../shared/protfolio-iban-usd';
import { PortfolioIbanEurComponent } from '../shared/protfolio-iban-eur';
import { PortfolioCustodial } from '../shared/protfolio-custodial';


@Component({
  selector: 'app-wallet',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    SidebarComponent,
    MatIconModule,
    TransactionsComponent,
    PortfolioWalletComponent,
    MatButtonModule,
    MatDialogModule,
    PortfolioIbanUsdComponent,
    PortfolioIbanEurComponent,
    PortfolioCustodial
  ],
  standalone: true
})
export class WalletComponent {

  constructor(private dialog: MatDialog) {}

  onCreateWallet(){
    this.dialog.open(CreateWalletDialog, {
      scrollStrategy: new NoopScrollStrategy(),
      autoFocus: false,
      panelClass: 'wallet-dialog',
      backdropClass: 'back-drop-class'
    })
  }

}
